import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Auth from "../utils/auth";
import ReactAudioPlayer from "react-audio-player";

const Singleplayer = () => {
    //here goes nothing!
    const [gameMode, setGameMode] = useState("singlePlayer");

    useEffect(() => {
        const winIcon = document.querySelector(".salute");
        const audio = document.getElementById("myaudio");
        audio.volume = 0.2;
        const userGrid = document.querySelector(".grid-user");
        const computerGrid = document.querySelector(".grid-computer");
        const displayGrid = document.querySelector(".grid-display");
        const ships = document.querySelectorAll(".ship");
        const destroyer = document.querySelector(".destroyer-container");
        const submarine = document.querySelector(".submarine-container");
        const cruiser = document.querySelector(".cruiser-container");
        const battleship = document.querySelector(".battleship-container");
        const carrier = document.querySelector(".carrier-container");
        const startButton = document.querySelector("#start");
        const rotateButton = document.querySelector("#rotate");
        const turnDisplay = document.querySelector("#whose-go");
        const infoDisplay = document.querySelector("#info");
        const setupButtons = document.getElementById("setup-buttons");
        const userSquares = [];
        const computerSquares = [];
        let isHorizontal = true;
        let isGameOver = false;
        let currentPlayer = "user";
        const width = 10;
        let playerNum = 0;
        let ready = false;
        let enemyReady = false;
        let allShipsPlaced = false;
        let shotFired = -1;
        let direction = "vertical";
        let selectedShipIndex = 1;
        /* let selectShipIndex = 1 */
        let count = 0;

        const shipArray = [
            {
                name: "destroyer",
                directions: [
                    [0, 1],
                    [0, width],
                ],
            },
            {
                name: "submarine",
                directions: [
                    [0, 1, 2],
                    [0, width, width * 2],
                ],
            },
            {
                name: "cruiser",
                directions: [
                    [0, 1, 2],
                    [0, width, width * 2],
                ],
            },
            {
                name: "battleship",
                directions: [
                    [0, 1, 2, 3],
                    [0, width, width * 2, width * 3],
                ],
            },
            {
                name: "carrier",
                directions: [
                    [0, 1, 2, 3, 4],
                    [0, width, width * 2, width * 3, width * 4],
                ],
            },
        ];

        createBoard(userGrid, userSquares);
        createBoard(computerGrid, computerSquares);

        //Select player mode
        if (gameMode === "singlePlayer") {
            startSinglePlayer();
        } else {
            startMultiPlayers();
        }

        //Multi player
        function startMultiPlayers() {
            const socket = io();

            socket.on("player-number", (num) => {
                if (num === -1) {
                    infoDisplay.innerHTML = "Server full!";
                } else {
                    playerNum = parseInt(num);
                    if (playerNum === 1) currentPlayer = "enemy";
                    console.log(playerNum);
                    socket.emit("check-players");
                }
            });

            socket.on("player-connection", (num) => {
                console.log(`Player ${num} has connected/disconnected`);
                playerConnectedOrDisconnected(num);
            });

            socket.on("enemy-ready", (num) => {
                enemyReady = true;
                playerReady(num);
                if (ready) {
                    playGameMulti(socket);
                    setupButtons.style.display = "none";
                }
            });

            socket.on("check-players", (players) => {
                players.forEach((p, i) => {
                    if (p.connected) playerConnectedOrDisconnected(i);
                    if (players.ready) {
                        playerReady(i);
                        if (i !== playerReady) enemyReady = true;
                    }
                });
            });

            socket.on("timeout", () => {
                infoDisplay.innerHTML = "You have timed out.";
            });

            startButton.addEventListener("click", () => {
                if (allShipsPlaced) playGameMulti(socket);
                else infoDisplay.innerHTML = "Please place all your ships.";
            });

            computerSquares.forEach((square) => {
                square.addEventListener("click", () => {
                    if (currentPlayer === "user" && ready && enemyReady) {
                        shotFired = square.dataset.id;
                        socket.emit("fire", shotFired);
                    }
                });
            });

            socket.on("fire", (id) => {
                enemyGo(id);
                const square = userSquares[id];
                socket.emit("fire-reply", square.classList);
                playGameMulti(socket);
            });

            function playerConnectedOrDisconnected(num) {
                let player = `.p${parseInt(num) + 1}`;
                document
                    .querySelector(`${player} .connected`)
                    .classList.toggle("active");
                if (parseInt(num) === playerNum)
                    document.querySelector(player).style.fontWeight = "bold";
            }
        }

        function startSinglePlayer() {
            generate(shipArray[0]);
            generate(shipArray[1]);
            generate(shipArray[2]);
            generate(shipArray[3]);
            generate(shipArray[4]);

            startButton.addEventListener("click", () => {
                setupButtons.style.display = "none";
                playGameSingle();
            });
        }

        function createBoard(grid, squares) {
            for (let i = 0; i < width * width; i++) {
                const square = document.createElement("div");
                square.dataset.id = i;
                grid.appendChild(square);
                squares.push(square);
            }
        }

        // function generate(ship) {
        //     let randomDirection = Math.floor(Math.random() * ship.directions.length);
        //     let current = ship.directions[randomDirection];
        //     let isTaken = false;
        //     let randomStart = 0;

        //     do {
        //         isTaken = false;
        //         randomDirection = Math.floor(Math.random() * ship.directions.length);
        //         current = ship.directions[randomDirection];
        //         randomStart = Math.floor(Math.random() * computerSquares.length);
        //         const isAtRightEdge = current.some(
        //             (index) => (randomStart + index) % width === width - 1
        //         );
        //         const isAtLeftEdge = current.some(
        //             (index) => (randomStart + index) % width === 0
        //         );

        //         if (!isAtLeftEdge && !isAtRightEdge) {
        //             isTaken = current.some((index) =>
        //                 computerSquares[randomStart + index].classList.contains("taken")
        //             );
        //         }
        //     } while (isTaken);

        //     current.forEach((index) => {
        //         computerSquares[randomStart + index].classList.add("taken", ship.name);
        //     });
        // }

        function generate(ship) {
            let randomDirection = Math.floor(Math.random() * ship.directions.length);
            let current = ship.directions[randomDirection];
            if (randomDirection === 0) direction = 1;
            if (randomDirection === 1) direction = 10;
            let randomStart = Math.floor(Math.random() * 100);

            const isTaken = current.some(index =>
                computerSquares[randomStart + index].classList.contains('taken')
            );
            const isAtRightEdge = current.some(
                (index) => (randomStart + index) % width === width - 1
            );
            const isAtLeftEdge = current.some(
                (index) => (randomStart + index) % width === 0
            );

            if (!isTaken && !isAtLeftEdge && !isAtRightEdge) {
                if (ship.name === "destroyer") {
                    computerSquares[randomStart + 0].classList.add("taken", ship.name);
                    computerSquares[randomStart + 1].classList.add("taken", ship.name);
                } else if (ship.name === "submarine") {
                    computerSquares[randomStart + 0].classList.add("taken", ship.name);
                    computerSquares[randomStart + 1].classList.add("taken", ship.name);
                    computerSquares[randomStart + 2].classList.add("taken", ship.name);
                } else if (ship.name === "cruiser") {
                    computerSquares[randomStart + 0].classList.add("taken", ship.name);
                    computerSquares[randomStart + 1].classList.add("taken", ship.name);
                    computerSquares[randomStart + 2].classList.add("taken", ship.name);
                } else if (ship.name === "battleship") {
                    computerSquares[randomStart + 0].classList.add("taken", ship.name);
                    computerSquares[randomStart + 1].classList.add("taken", ship.name);
                    computerSquares[randomStart + 2].classList.add("taken", ship.name);
                    computerSquares[randomStart + 3].classList.add("taken", ship.name);
                } else if (ship.name === "carrier") {
                    computerSquares[randomStart + 0].classList.add("taken", ship.name);
                    computerSquares[randomStart + 1].classList.add("taken", ship.name);
                    computerSquares[randomStart + 2].classList.add("taken", ship.name);
                    computerSquares[randomStart + 3].classList.add("taken", ship.name);
                    computerSquares[randomStart + 4].classList.add("taken", ship.name);
                }
            } else generate(ship);
        }

        function rotate() {
            if (isHorizontal) {
                destroyer.classList.toggle("destroyer-container-vertical");
                submarine.classList.toggle("submarine-container-vertical");
                cruiser.classList.toggle("cruiser-container-vertical");
                battleship.classList.toggle("battleship-container-vertical");
                carrier.classList.toggle("carrier-container-vertical");
                isHorizontal = false;

                return;
            }
            if (!isHorizontal) {
                destroyer.classList.toggle("destroyer-container-vertical");
                submarine.classList.toggle("submarine-container-vertical");
                cruiser.classList.toggle("cruiser-container-vertical");
                battleship.classList.toggle("battleship-container-vertical");
                carrier.classList.toggle("carrier-container-vertical");
                isHorizontal = true;

                return;
            }
        }
        rotateButton.addEventListener("click", rotate);

        ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
        userSquares.forEach((square) =>
            square.addEventListener("dragstart", dragStart)
        );
        userSquares.forEach((square) =>
            square.addEventListener("dragover", dragOver)
        );
        userSquares.forEach((square) =>
            square.addEventListener("dragenter", dragEnter)
        );
        userSquares.forEach((square) =>
            square.addEventListener("dragleave", dragLeave)
        );
        userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
        userSquares.forEach((square) =>
            square.addEventListener("dragend", dragEnd)
        );

        let selectedShipNameWithIndex;
        let draggedShip;
        let draggedShipLength;

        ships.forEach((ship) =>
            ship.addEventListener("mousedown", (e) => {
                selectedShipNameWithIndex = e.target.id;
            })
        );

        function dragStart() {
            draggedShip = this;
            draggedShipLength = this.childNodes.length;
            console.log(draggedShip);
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function dragEnter(e) {
            e.preventDefault();
        }

        function dragLeave() {
            console.log("drag leave");
        }

        function dragDrop() {
            console.log(userSquares);
            let shipNameWithLastId = draggedShip.lastChild.id;
            let shipClass = shipNameWithLastId.slice(0, -2);
            let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
            let shipLastId = lastShipIndex + parseInt(this.dataset.id);
            const notAllowedHorizontal = [
                0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71,
                81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63,
                73, 83, 93,
            ];
            const notAllowedVertical = [
                99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82,
                81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64,
                63, 62, 61, 60,
            ];

            let newNotAllowedHorizontal = notAllowedHorizontal.splice(
                0,
                10 * lastShipIndex
            );
            let newNotAllowedVertical = notAllowedVertical.splice(
                0,
                10 * lastShipIndex
            );

            selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

            shipLastId = shipLastId - selectedShipIndex;
            /* const test = parseInt(this.dataset.id) - selectShipIndex + 0
                        console.log (selectShipIndex);
                        const test2 = parseInt(this.dataset.id) - selectShipIndex + width * 0
                        console.log (parseInt(this.dataset.id)); */
            if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
                for (let i = 0; i < draggedShipLength; i++) {
                    let directionClass;
                    if (i === 0) directionClass = "start";
                    if (i === draggedShipLength - 1) directionClass = "end";
                    userSquares[
                        parseInt(this.dataset.id) - selectedShipIndex + i
                    ].classList.add("taken", "horizontal", directionClass, shipClass);
                }
            } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
                for (let i = 0; i < draggedShipLength; i++) {
                    let directionClass;
                    if (i === 0) directionClass = "start";
                    if (i === draggedShipLength - 1) directionClass = "end";
                    userSquares[
                        parseInt(this.dataset.id) - selectedShipIndex + width * i
                    ].classList.add("taken", "vertical", directionClass, shipClass);
                }
            } else return;

            displayGrid.removeChild(draggedShip);
            if (!displayGrid.querySelector(".ship")) allShipsPlaced = true;
        }

        function dragEnd() {
            console.log("dragend");
        }

        function playGameMulti(socket) {
            setupButtons.style.display = "none";
            if (isGameOver) return;
            if (!ready) {
                socket.emit("player-ready");
                ready = true;
                playerReady(playerNum);
            }

            if (enemyReady) {
                if (currentPlayer === "user") {
                    turnDisplay.innerHTML = "Player Turn";
                }
                if (currentPlayer === "enemy") {
                    turnDisplay.innerHTML = "Opponent Turn";
                }
            }
        }

        function playerReady(num) {
            let player = `.p${parseInt(num) + 1}`;
            document.querySelector(`${player}.ready`).classList.toggle("active");
        }

        function playGameSingle() {
            if (isGameOver) return;
            if (currentPlayer === "user") {
                turnDisplay.innerHTML = "Your Turn";
                computerSquares.forEach((square) =>
                    square.addEventListener("click", function (e) {
                        shotFired = square.dataset.id;
                        revealSquare(square.classList);
                    })
                );
            }
            if (currentPlayer === "enemy") {
                turnDisplay.innerHTML = "Computers Go";
                setTimeout(enemyGo, 1000);
            }
        }

        let destroyerCount = 0;
        let submarineCount = 0;
        let cruiserCount = 0;
        let battleshipCount = 0;
        let carrierCount = 0;

        function revealSquare(classList) {
            const enemySquare = computerGrid.querySelector(
                `div[data-id='${shotFired}']`
            );
            const obj = Object.values(classList);
            if (
                !enemySquare.classList.contains("boom") &&
                currentPlayer === "user" &&
                !isGameOver
            ) {
                if (obj.includes("destroyer")) destroyerCount++;
                if (obj.includes("submarine")) submarineCount++;
                if (obj.includes("cruiser")) cruiserCount++;
                if (obj.includes("battleship")) battleshipCount++;
                if (obj.includes("carrier")) carrierCount++;
            }
            if (obj.includes("taken")) {
                enemySquare.classList.add("boom");
            } else {
                enemySquare.classList.add("miss");
            }
            
            currentPlayer = "enemy";
            if (gameMode === "singlePlayer") playGameSingle();
            checkForWins();
        }

        let cpuDestroyerCount = 0;
        let cpuSubmarineCount = 0;
        let cpuCruiserCount = 0;
        let cpuBattleshipCount = 0;
        let cpuCarrierCount = 0;

        function enemyGo(square) {
            if (gameMode === "singlePlayer")
                square = Math.floor(Math.random() * userSquares.length);
            if (!userSquares[square].classList.contains("boom")) {
                const hit = userSquares[square].classList.contains("taken");
                userSquares[square].classList.add(hit ? "boom" : "miss");
                if (userSquares[square].classList.contains("destroyer"))
                    cpuDestroyerCount++;
                if (userSquares[square].classList.contains("submarine"))
                    cpuSubmarineCount++;
                if (userSquares[square].classList.contains("cruiser"))
                    cpuCruiserCount++;
                if (userSquares[square].classList.contains("battleship"))
                    cpuBattleshipCount++;
                if (userSquares[square].classList.contains("carrier"))
                    cpuCarrierCount++;
                checkForWins();
            } else if (gameMode === "singlePlayer") enemyGo();
            currentPlayer = "user";
            turnDisplay.innerHTML = "Your Turn";
        }

        function checkForWins() {
            let enemy = "computer";
            if (gameMode === "multiPlayer") enemy = "enemy";
            if (destroyerCount === 2) {
                infoDisplay.innerHTML = `You sunk the ${enemy}'s destroyer`;
                destroyerCount = 2;
            }
            if (submarineCount === 3) {
                infoDisplay.innerHTML = `You sunk the ${enemy}'s submarine`;
                submarineCount = 3;
            }
            if (cruiserCount === 3) {
                infoDisplay.innerHTML = `You sunk the ${enemy}'s cruiser`;
                cruiserCount = 3;
            }
            if (battleshipCount === 4) {
                infoDisplay.innerHTML = `You sunk the ${enemy}'s battleship`;
                battleshipCount = 4;
            }
            if (carrierCount === 5) {
                infoDisplay.innerHTML = `You sunk the ${enemy}'s carrier`;
                carrierCount = 5;
            }
            if (cpuDestroyerCount === 2) {
                infoDisplay.innerHTML = `${enemy} sunk your destroyer`;
                cpuDestroyerCount = 2;
            }
            if (cpuSubmarineCount === 3) {
                infoDisplay.innerHTML = `${enemy} sunk your submarine`;
                cpuSubmarineCount = 3;
            }
            if (cpuCruiserCount === 3) {
                infoDisplay.innerHTML = `${enemy} sunk your cruiser`;
                cpuCruiserCount = 3;
            }
            if (cpuBattleshipCount === 4) {
                infoDisplay.innerHTML = `${enemy} sunk your battleship`;
                cpuBattleshipCount = 4;
            }
            if (cpuCarrierCount === 5) {
                infoDisplay.innerHTML = `${enemy} sunk your carrier`;
                cpuCarrierCount = 5;
            }

            if (
                destroyerCount +
                submarineCount +
                cruiserCount +
                battleshipCount +
                carrierCount ===
                17
            ) {
                infoDisplay.innerHTML = "YOU WIN";
                gameOver();
            }
            if (
                cpuDestroyerCount +
                cpuSubmarineCount +
                cpuCruiserCount +
                cpuBattleshipCount +
                cpuCarrierCount ===
                17
            ) {
                infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS`;
                
                gameOver();
            }
        }

        function gameOver() {
            isGameOver = true;
            startButton.removeEventListener("click", playGameSingle);
            winIcon.style.display = "block";
            winIcon.animate(
                [
                    {
                        left: "-300px",
                        top: "0px",
                    },
                    {
                        left: "1000px",
                        top: "0px",
                    },
                ],
                { duration: 5000, iterations: Infinity }
            );

        }
    }, []);

    return (
        <div>
            <h1>Singleplayer</h1>
            <img
                src="../images/vaporeonsalute.png"
                alt="salute"
                className="salute"
            />
            <div className="container">
                <div className="battleship-grid grid-user"></div>
                <div className="battleship-grid grid-computer"></div>
            </div>
            <div className="container hidden-info">
                <div
                    className="setup-buttons"
                    id="setup-buttons"
                    style={{ marginTop: "1rem" }}
                >
                    <button style={{ marginRight: "3rem" }} id="start" className="btn">
                        Start Game
                    </button>
                    <button id="rotate" className="btn">
                        Rotate Ships
                    </button>
                </div>

                <h3 id="whose-go" className="info-text">
                    Your Turn
                </h3>
                <h3 id="info" className="info-text"></h3>
            </div>

            <div className="container">
                <div className="grid-display">
                    <div className="ship destroyer-container" draggable="true">
                        <div id="destroyer-0"></div>
                        <div id="destroyer-1"></div>
                    </div>
                    <div className="ship submarine-container" draggable="true">
                        <div id="submarine-0"></div>
                        <div id="submarine-1"></div>
                        <div id="submarine-2"></div>
                    </div>
                    <div className="ship cruiser-container" draggable="true">
                        <div id="cruiser-0"></div>
                        <div id="cruiser-1"></div>
                        <div id="cruiser-2"></div>
                    </div>
                    <div className="ship battleship-container" draggable="true">
                        <div id="battleship-0"></div>
                        <div id="battleship-1"></div>
                        <div id="battleship-2"></div>
                        <div id="battleship-3"></div>
                    </div>
                    <div className="ship carrier-container" draggable="true">
                        <div id="carrier-0"></div>
                        <div id="carrier-1"></div>
                        <div id="carrier-2"></div>
                        <div id="carrier-3"></div>
                        <div id="carrier-4"></div>
                    </div>
                </div>
            </div>
            <div className="audio">
                <audio
                    id="myaudio"
                    src="../audio/DangerZone.mp3"
                    autoPlay="true"
                    volume="0.1"
                    loop="true"
                    style={{ marginTop: "1rem" }}
                    controls
                />
            </div>
            <footer>Thanks 4 playing! ❤️ Team Vaporeon</footer>
        </div>
    );
};

export default Singleplayer;

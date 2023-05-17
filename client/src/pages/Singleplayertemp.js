import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Singleplayer = () => {
    //here goes nothing!

        const [isHorizontal, setIsHorizontal] = useState(true);
        const [isGameOver, setIsGameOver] = useState(false);
        const [currentPlayer, setCurrentPlayer] = useState('user');
        const [playerNum, setPlayerNum] = useState(0);
        const [ready, setReady] = useState(false);
        const [enemyReady, setEnemyReady] = useState(false);
        const [allShipsPlaced, setAllShipsPlaced] = useState(false);
        const [shotFired, setShotFired] = useState(-1);

        const userGridRef = useRef(null);
        const computerGridRef = useRef(null);
        const displayGridRef = useRef(null);
        const shipsRef = useRef([]);
        const destroyerRef = useRef(null);
        const submarineRef = useRef(null);
        const cruiserRef = useRef(null);
        const battleshipRef = useRef(null);
        const carrierRef = useRef(null);
        const startButtonRef = useRef(null);
        const rotateButtonRef = useRef(null);
        const turnDisplayRef = useRef(null);
        const infoDisplayRef = useRef(null);
        const setupButtonsRef = useRef(null);
        const userSquaresRef = useRef([]);
        const computerSquaresRef = useRef([]);
        const width = 10;
    
        const shipArray = [
            {
                name: 'destroyer',
                directions: [
                    [0, 1],
                    [0, width]
                ]
            },
            {
                name: 'submarine',
                directions: [
                    [0, 1, 2],
                    [0, width, width * 2]
                ]
            },
            {
                name: 'cruiser',
                directions: [
                    [0, 1, 2],
                    [0, width, width * 2]
                ]
            },
            {
                name: 'battleship',
                directions: [
                    [0, 1, 2, 3],
                    [0, width, width * 2, width * 3],
                ]
            },
            {
                name: 'carrier',
                directions: [
                    [0, 1, 2, 3, 4],
                    [0, width, width * 2, width * 3, width * 4]
                ]
            },
        ];

            const [userSquares, setUserSquares] = useState([]);
            const [computerSquares, setComputerSquares] = useState([]);
            const [gameMode, setGameMode] = useState('singlePlayer');

            useEffect(() => {
                createBoard(userGrid, setUserSquares);
                createBoard(computerGrid, setComputerSquares);

                if (gameMode === 'singlePlayer') {
                    startSinglePlayer();
                } else {
                    startMultiPlayers();
                }
            }, []);

            const startSinglePlayer = () => {
                // Single player logic
            };

            const startMultiPlayers = () => {
                // Multi player logic
            };

            useEffect(() => {
                const socket = io();

                socket.on('player-number', num => {
                    if (num === -1) {
                        infoDisplay.innerHTML = 'Server full!';
                    } else {
                        setPlayerNum(parseInt(num));
                        if (parseInt(num) === 1) setCurrentPlayer('enemy');
                        console.log(num);
                        socket.emit('check-players');
                    }
                });

                socket.on('player-connection', num => {
                    console.log(`Player ${num} has connected/disconnected`);
                    playerConnectedOrDisconnected(num);
                });

                socket.on('enemy-ready', num => {
                    setEnemyReady(true);
                    playerReady(num);
                    if (ready) {
                        playGameMulti(socket);
                        setupButtons.style.display = 'none';
                    }
                });
            }, []);

            useEffect(() => {
                // ...

                socket.on('check-players', players => {
                    players.forEach((p, i) => {
                        if (p.connected) playerConnectedOrDisconnected(i);
                        if (p.ready) {
                            playerReady(i);
                            if (i !== playerReady) setEnemyReady(true);
                        }
                    });
                });

                socket.on('timeout', () => {
                    setInfoDisplay('You have timed out.');
                });

                // ...

                startButton.addEventListener('click', () => {
                    if (allShipsPlaced) playGameMulti(socket);
                    else setInfoDisplay('Please place all your ships.');
                });

                // ...

                socket.on('fire', id => {
                    enemyGo(id);
                    const square = userSquares[id];
                    socket.emit('fire-reply', square.classList);
                    playGameMulti(socket);
                });

                function playerConnectedOrDisconnected(num) {
                    let player = `.p${parseInt(num) + 1}`;
                    document.querySelector(`${player} .connected`).classList.toggle('active');
                    if (parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold';
                }

                // ...
            }, []);

            useEffect(() => {
                // ...

                function startSinglePlayer() {
                    generate(shipArray[0]);
                    generate(shipArray[1]);
                    generate(shipArray[2]);
                    generate(shipArray[3]);
                    generate(shipArray[4]);

                    // ...
                }

                function createBoard(grid, squares) {
                    const newSquares = [];
                    for (let i = 0; i < width * width; i++) {
                        const square = <div key={i} />;
                        newSquares.push(square);
                    }
                    squares(newSquares);
                }

                function generate(ship) {
                    let randomDirection = Math.floor(Math.random() * ship.directions.length);
                    let current = ship.directions[randomDirection];
                    let direction;
                    if (randomDirection === 0) direction = 1;
                    if (randomDirection === 1) direction = 10;
                    let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - ship.directions[0].length * direction));

                    const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
                    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
                    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);

                    if (!isTaken && !isAtLeftEdge && !isAtRightEdge)
                        current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name));
                    else generate(ship);
                }

                function rotate() {
                    setIsHorizontal(!isHorizontal);
                    // ...
                }

                // ...
            }, []);

            const [selectedShipNameWithIndex, setSelectedShipNameWithIndex] = useState('');
            const [draggedShip, setDraggedShip] = useState(null);
            const [draggedShipLength, setDraggedShipLength] = useState(0);

            const rotate = () => {
                setIsHorizontal(!isHorizontal);
                // ...
            };

            const dragStart = (e) => {
                setDraggedShip(e.target);
                setDraggedShipLength(e.target.childNodes.length);
                // ...
            };

            const dragOver = (e) => {
                e.preventDefault();
                // ...
            };

            const dragEnter = (e) => {
                e.preventDefault();
                // ...
            };

            const dragLeave = () => {
                console.log('drag leave');
                // ...
            };

            return (
                // JSX markup for the game component
                // ...
            <div>
                <button onClick={rotate}>Rotate</button>
                <div>
            { ships.map((ship) => {
                    return <div
                        key={ship.id}
                        id={ship.id}
                        draggable={true}
                        onDragStart={dragStart}
                    // ...
                    >
                        {/* ship content */}
                    </div>
            })
            }
            </div>
            <div>
            {
                userSquares.map((square) => (
                    <div
                        key={square.id}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={dragOver}
                        onDragEnter={dragEnter}
                        onDragLeave={dragLeave}
                    // ...
                    >
                        {/* square content */}
                    </div>
                ))
            }
            </div>
            </div>
        );
        };

const dragDrop = (e) => {
    e.preventDefault();
    const shipNameWithLastId = draggedShip.lastChild.id;
    const shipClass = shipNameWithLastId.slice(0, -2);
    const lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(e.target.dataset.id);
    const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93];
    const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60];

    const newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
    const newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

    const selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    shipLastId = shipLastId - selectedShipIndex;

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
        for (let i = 0; i < draggedShipLength; i++) {
            let directionClass;
            if (i === 0) directionClass = 'start';
            if (i === draggedShipLength - 1) directionClass = 'end';
            // Update state or props to add CSS classes to the corresponding square
            // For example:
            // userSquares[parseInt(e.target.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass);
        }
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
        for (let i = 0; i < draggedShipLength; i++) {
            let directionClass;
            if (i === 0) directionClass = 'start';
            if (i === draggedShipLength - 1) directionClass = 'end';
            // Update state or props to add CSS classes to the corresponding square
            // For example:
            // userSquares[parseInt(e.target.dataset.id) - selectedShipIndex + width * i].classList.add('taken', 'vertical', directionClass, shipClass);
        }
    } else return;

    // Update state or props to remove the dragged ship from the display grid
    // For example:
    // display

    const dragEnd = () => {
        console.log('dragend');
    };

    const playGameMulti = (socket) => {
        setupButtons.style.display = 'none';
        if (isGameOver) return;
        if (!ready) {
            socket.emit('player-ready');
            setReady(true);
            playerReady(playerNum);
        }

        if (enemyReady) {
            if (currentPlayer === 'user') {
                setTurnDisplay('Player Turn');
            }
            if (currentPlayer === 'enemy') {
                setTurnDisplay('Opponent Turn');
            }
        }
    };

    const playerReady = (num) => {
        let player = `.p${parseInt(num) + 1}`;
        document.querySelector(`${player}.ready`).classList.toggle('active');
    };

    const playGameSingle = () => {
        if (isGameOver) return;
        if (currentPlayer === 'user') {
            setTurnDisplay('Your Go');
            computerSquares.forEach((square) => {
                square.addEventListener('click', (e) => {
                    const shotFired = square.dataset.id;
                    revealSquare(square.classList);
                });
            });
        }
        if (currentPlayer === 'enemy') {
            setTurnDisplay('Computers Go');
            setTimeout(enemyGo, 1000);
        }
    };

        const [destroyerCount, setDestroyerCount] = useState(0);
        const [submarineCount, setSubmarineCount] = useState(0);
        const [cruiserCount, setCruiserCount] = useState(0);
        const [battleshipCount, setBattleshipCount] = useState(0);
        const [carrierCount, setCarrierCount] = useState(0);

        const revealSquare = (classList) => {
            const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`);
            const obj = Object.values(classList);
            if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
                if (obj.includes('destroyer')) setDestroyerCount((count) => count + 1);
                if (obj.includes('submarine')) setSubmarineCount((count) => count + 1);
                if (obj.includes('cruiser')) setCruiserCount((count) => count + 1);
                if (obj.includes('battleship')) setBattleshipCount((count) => count + 1);
                if (obj.includes('carrier')) setCarrierCount((count) => count + 1);
            }
            if (obj.includes('taken')) {
                enemySquare.classList.add('boom');
            } else {
                enemySquare.classList.add('miss');
            }
            checkForWins();
            setCurrentPlayer('enemy');
            if (gameMode === 'singlePlayer') playGameSingle();
        };

        const [cpuDestroyerCount, setCpuDestroyerCount] = useState(0);
        const [cpuSubmarineCount, setCpuSubmarineCount] = useState(0);
        const [cpuCruiserCount, setCpuCruiserCount] = useState(0);
        const [cpuBattleshipCount, setCpuBattleshipCount] = useState(0);
        const [cpuCarrierCount, setCpuCarrierCount] = useState(0);

        const enemyGo = (square) => {
            if (gameMode === 'singlePlayer') square = Math.floor(Math.random() * userSquares.length);
            if (!userSquares[square].classList.contains('boom')) {
                const hit = userSquares[square].classList.contains('taken');
                userSquares[square].classList.add(hit ? 'boom' : 'miss');
                if (userSquares[square].classList.contains('destroyer'))
                    setCpuDestroyerCount((count) => count + 1);
                if (userSquares[square].classList.contains('submarine'))
                    setCpuSubmarineCount((count) => count + 1);
                if (userSquares[square].classList.contains('cruiser'))
                    setCpuCruiserCount((count) => count + 1);
                if (userSquares[square].classList.contains('battleship'))
                    setCpuBattleshipCount((count) => count + 1);
                if (userSquares[square].classList.contains('carrier'))
                    setCpuCarrierCount((count) => count + 1);
                checkForWins();
            } else if (gameMode === 'singlePlayer') enemyGo();
            setCurrentPlayer('user');
            setTurnDisplay('Your Go');
        };

        const [infoDisplay, setInfoDisplay] = useState('');

        const checkForWins = () => {
            let enemy = 'computer';
            if (gameMode === 'multiPlayer') enemy = 'enemy';
            if (destroyerCount === 2) {
                setInfoDisplay(`You sunk the ${enemy}'s destroyer`);
                setDestroyerCount(10);
            }
            if (submarineCount === 3) {
                setInfoDisplay(`You sunk the ${enemy}'s submarine`);
                setSubmarineCount(10);
            }
            if (cruiserCount === 3) {
                setInfoDisplay(`You sunk the ${enemy}'s cruiser`);
                setCruiserCount(10);
            }
            if (battleshipCount === 4) {
                setInfoDisplay(`You sunk the ${enemy}'s battleship`);
                setBattleshipCount(10);
            }
            if (carrierCount === 5) {
                setInfoDisplay(`You sunk the ${enemy}'s carrier`);
                setCarrierCount(10);
            }
            if (cpuDestroyerCount === 2) {
                setInfoDisplay(`${enemy} sunk your destroyer`);
                setCpuDestroyerCount(10);
            }
        
                const [cpuSubmarineCount, setCpuSubmarineCount] = useState(0);
                const [cpuCruiserCount, setCpuCruiserCount] = useState(0);
                const [cpuBattleshipCount, setCpuBattleshipCount] = useState(0);
                const [cpuCarrierCount, setCpuCarrierCount] = useState(0);
                const [isGameOver, setIsGameOver] = useState(false);
                const [infoDisplay, setInfoDisplay] = useState('');

                const checkForWins = () => {
                    let enemy = 'computer';
                    if (gameMode === 'multiPlayer') enemy = 'enemy';

                    if (cpuSubmarineCount === 3) {
                        setInfoDisplay(`${enemy} sunk your submarine`);
                        setCpuSubmarineCount(10);
                    }
                    if (cpuCruiserCount === 3) {
                        setInfoDisplay(`${enemy} sunk your cruiser`);
                        setCpuCruiserCount(10);
                    }
                    if (cpuBattleshipCount === 4) {
                        setInfoDisplay(`${enemy} sunk your battleship`);
                        setCpuBattleshipCount(10);
                    }
                    if (cpuCarrierCount === 5) {
                        setInfoDisplay(`${enemy} sunk your carrier`);
                        setCpuCarrierCount(10);
                    }

                    if (
                        destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount === 50
                    ) {
                        setInfoDisplay('YOU WIN');
                        setIsGameOver(true);
                    }
                    if (
                        cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount === 50
                    ) {
                        setInfoDisplay(`${enemy.toUpperCase()} WINS`);
                        setIsGameOver(true);
                    }
                };

                const gameOver = () => {
                    setIsGameOver(true);
                };

                useEffect(() => {
                    startButton.removeEventListener('click', playGameSingle);
                }, []);

                return (
                    <div>
                        {/* Render other components and UI */}
                    </div>
                );
            };


            return (
                <div>
                    <nav class="navbar">
                        <ul class="navbar-nav">
                            <li class="nav-item">High Scores</li>
                            <li class="nav-item">New Game</li>
                        </ul>
                    </nav>
                    <h1>Single player</h1>
                    <div class="container">
                        <div class="battleship-grid grid-user"></div>
                        <div class="battleship-grid grid-computer"></div>
                    </div>

                    <div class="container hidden-info">
                        <div class="setup-buttons" id="setup-buttons">
                            <button id="start" class="btn">Start Game</button>
                            <button id="rotate" class="btn">Rotate Ships</button>
                        </div>
                        <h3 id="whose-go" class="info-text">Your Go</h3>
                        <h3 id="info" class="info-text"></h3>
                    </div>

                    <div class="container">
                        <div class="grid-display">
                            <div class="ship destroyer-container" draggable="true">
                                <div id="destroyer-0"></div>
                                <div id="destroyer-1"></div>
                            </div>
                            <div class="ship submarine-container" draggable="true">
                                <div id="submarine-0"></div>
                                <div id="submarine-1"></div>
                                <div id="submarine-2"></div>
                            </div>
                            <div class="ship cruiser-container" draggable="true">
                                <div id="cruiser-0"></div>
                                <div id="cruiser-1"></div>
                                <div id="cruiser-2"></div>
                            </div>
                            <div class="ship battleship-container" draggable="true">
                                <div id="battleship-0"></div>
                                <div id="battleship-1"></div>
                                <div id="battleship-2"></div>
                                <div id="battleship-3"></div>
                            </div>
                            <div class="ship carrier-container" draggable="true">
                                <div id="carrier-0"></div>
                                <div id="carrier-1"></div>
                                <div id="carrier-2"></div>
                                <div id="carrier-3"></div>
                                <div id="carrier-4"></div>
                            </div>
                        </div>

                    </div>
                </div>
            )
        }

        export default Singleplayer;
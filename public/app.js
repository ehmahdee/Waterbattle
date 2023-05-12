document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('grid-user')
    const computerGrid = document.querySelector('.grid-computer')
    const displayGrid = document.querySelector('.grid-display')
    const ships = document.querySelectorAll('.ship')
    const destroyer = document.querySelector('.destroyer-container')
    const submarine = document.querySelector('.submarine-container')
    const cruiser = document.querySelector('.cruiser-container')
    const battleship = document.querySelector('.battleship-container')
    const carrier = document.querySelector('.carrier-container')
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    const turnDisplay = document.querySelector('#whose-go')
    const infoDisplay = document.querySelector('#info')
    const setupButtons = document.getElementById('setup-buttons')
    const userSquares = []
    const computerSquares = []
    let isHorizontal = true
    let isGameOver = false
    let currentPlayer = 'user'
    const width = 10
    let playerNum = 0
    let ready = false
    let enemyReady = false
    let allShipsPlaced = false
    let shotFired = -1

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
                [0, width, width*2]
            ]
        },
        {
            name: 'cruiser',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0, 1, 2, 3],
                [0, width, width*2, width*3],
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4],
                [0, width, width*2, width*3, width*4]
            ]
        },
    ]

    createBoard(userGrid, userSquares)
    createBoard(computerGrid, computerSquares)

    //Select player mode
    if (gameMode === 'singlePlayer') {
        startSinglePlayer()
    } else {
        startMultiPlayers()
    }

    //Multi player
    function startMultiPlayers() {
        const socket = io();

        socket.on('player-number', num => {
            if (num === -1) {
                infoDisplay.innerHTML = 'Server full!'
            } else {
                playerNum = parseInt(num)
                if (playerNum ===1) currentPlayer = "enemy"
                console.log(playerNum)
                socket.emit('check-players')
            }
        })

        socket.on('player-connection', num => {
            console.log(`Player ${num} has connected/disconnected`)
            playerConnectedOrDisconnected(num)
        })

        socket.on('enemy-ready', num => {
            enemyReady = true
            playerReady(num)
            if (ready) {
                playGameMulti(socket)
                setupButtons.style.display = 'none'
            }
        })

        socket.on('check-players', players => {
            players.forEach((p, i) => {
                if(p.connected) playerConnectedOrDisconnected(i)
                if (players.ready) {
                    playerReady(i)
                    if(i !== playerReady) enemyReady = true
                }
            })
        })

        socket.on('timeout', () => {
            infoDisplay.innerHTML = 'You have timed out.'
        })

        startButton.addEventListener('click', () => {
            if(allShipsPlaced) playGameMulti(socket)
            else infoDisplay.innerHTML = "Please place all your ships."
        })

        computerSquares.forEach(square => {
            square.addEventListener('click', () => {
                if(currentPlayer === 'user' && ready && enemyReady) {
                    shotFired = square.dataset.id
                    socket.emit('fire', shotFired)
                }
            })
        })

        socket.on('fire', id => {
            enemyGo(id)
            const square = userSquares[id]
            socket.emit('fire-reply', square.classList)
            playGameMulti(socket)
        })

        function playerConnectedOrDisconnected(num) {
            let player = `.p${parseInt(num) + 1}`
            document.querySelector(`${player} .connected`).classList.toggle('active')
            if(parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold'
        }
    }

    function startSinglePlayer() {
        
    }
})
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
})

const io = socketio(server);
// Handle a socket connection request from web client
const connections = [null, null]

io.on('connection', socket => {
    // console.log('New WS Connection')

    // Find an available player number
    let playerIndex = -1;
    for (const i in connections) {
        if (connections[i] === null) {
            playerIndex = i
            break
        }
    }

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)

    console.log(`Player ${playerIndex} has connected`)

    // Ignore player 3
    if (playerIndex === -1) return

    connections[playerIndex] = false

    // Tell eveyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex)

    // Handle Diconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex] = null
        //Tell everyone what player numbe just disconnected
        socket.broadcast.emit('player-connection', playerIndex)
    })

    // On Ready
    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex)
        connections[playerIndex] = true
    })

    // Check player connections
    socket.on('check-players', () => {
        const players = []
        for (const i in connections) {
            connections[i] === null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] })
        }
        socket.emit('check-players', players)
    })

    // On Fire Received
    socket.on('fire', id => {
        console.log(`Shot fired from ${playerIndex}`, id)

        // Emit the move to the other player
        socket.broadcast.emit('fire', id)
    })

    // on Fire Reply
    socket.on('fire-reply', square => {
        console.log(square)

        // Forward the reply to the other player
        socket.broadcast.emit('fire-reply', square)
    })

    // Timeout connection
    setTimeout(() => {
        connections[playerIndex] = null
        socket.emit('timeout')
        socket.disconnect()
    }, 600000) // 10 minute limit per player
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
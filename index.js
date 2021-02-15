const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '/public')

app.use(express.static(publicDirectoryPath))

const users = {}

io.on('connection', socket => {

    socket.on('new user', function (data, callback) {
        if (data in users) {
            callback(false)
        } else {
            callback(true)
            socket.nickname = data
            users[socket.nickname] = socket
            socket.emit('new message', {msg: `Welcome! ${socket.nickname}`,nick: 'Admin'})
            socket.broadcast.emit('new message', {msg: `${socket.nickname} has joined the chat!`,nick: 'Admin'})
            updateNicknames()
        }
    })

    function updateNicknames() {
        io.sockets.emit('usernames', Object.keys(users))
    }

    socket.on('send message', function (data, callback) {
        var msg = data.trim()
        if (msg.substr(0, 3) === '@w ') {
            msg = msg.substr(3)
            var ind = msg.indexOf(' ')
            if (ind != -1) {
                var name = msg.substring(0, ind)
                var msg = msg.substring(ind + 1)
                if (name in users) {
                    users[name].emit('whisper', { msg: msg, nick: socket.nickname})
                    socket.emit('whisper', {msg:' ['+ name +'] : '+ msg,nick: 'You'})
                } else {
                    callback({n:'Admin',m:'Error: Enter a valid user!'})
                }
            } else {
                callback({n:'Admin', m:'Error: Please enter a message for your whisper!'})
            }
        } else {
            socket.broadcast.emit('new message', {msg: msg,nick: socket.nickname})
            callback({n:'You', m:msg})
        }
    })

    socket.on('disconnect', function (data) {
        if (!socket.nickname) return
        delete users[socket.nickname]
        io.sockets.emit('new message', {msg: `${socket.nickname} has left!`,nick: 'Admin'})
        updateNicknames()
    })
})

server.listen(port, () => {
    console.log(`Server is up at port: ${port}!`)
})
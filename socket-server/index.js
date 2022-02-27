const http = require("http")
const express = require("express")
const cors = require("cors")
const socketIO = require("socket.io")

const app = express()
const port = process.env.PORT

app.use(cors())

app.get("/", (req, res) => {
    res.send("hello world")
})

const server = http.createServer(app)
const io = socketIO(server)

let users = []


const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}


const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

io.on("connection", (socket) => {

    socket.on("join server", (userData) => {
        addUser(userData.id, socket.id)
        socket.join(userData.id)
        io.emit("list online", [...users.map(user => user.userId)])
    })

    socket.on("join chat", (room) => {
        socket.join(room)
    })

    socket.on("leave chat", (room) => {
        socket.leave(room)
    })

    socket.on("new message", (newMessageRecived, room) => {
        socket.to(room).emit("message recived", newMessageRecived)
    })

    socket.on("send comment", (comment) => {
        socket.to(comment.self_id).emit("get comment", comment)
    })

    socket.on("send reaction", (reaction) => {
        socket.to(reaction.self_id).emit("get reaction", reaction)
    })

    socket.on("change topic", (obj,member) => {
        member.forEach(mem => {
            socket.to(mem.id).emit("get changed topic", obj)
        });
    })

    socket.on("add latest message", (latest_msg, member) => {
        member.forEach(mem => {
            socket.to(mem.id).emit("get latest message", latest_msg)
        });
    })
    socket.on("send deleted conversation", (convId, member) => {
        member.forEach(mem => {
            socket.to(mem.id).emit("get deleted conversation", convId)
        });
    })

    socket.on("send added conversation", (conversation, userId) => {
        console.log(userId);
            socket.to(userId).emit("get added conversation", conversation)
    })

    socket.on("leave server", (userData) => {
        removeUser(socket.id)
        socket.leave(userData.id)
        io.emit("list online", [...users.map(user => user.userId)])

    })


    socket.on("disconnect", () => {

        removeUser(socket.id)
        io.emit("list online", [...users.map(user => user.userId)])
    })
})



server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`);
})
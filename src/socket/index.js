const {Server} = require('socket.io');
const express = require('express');
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
  cors:"*"
})

// const connectSocket = ()=>{
//   io.on('connection',(socket)=>{
//     console.log('a user connected')
//     socket.on('disconnect',()=>{
//       console.log('user disconnected')
//     })
//     socket.on('chat message',(msg)=>{
//       console.log('message:'+msg)
//       io.emit('chat message',msg)
//     })
//   })
// }

module.exports = {app,server,io}


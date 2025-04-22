module.exports = (io) => {
    io.on('connection',(socket)=>{
        console.log(`${socket.id} connected`);

        socket.on('join',(room)=>{
            console.log(`${socket.id} joined room: ${room}`);
            socket.join(room);
            socket.to(room).emit('message',`${socket.id} joined room: ${room}`);
        });
        socket.on('message',({room, text})=>{
            console.log(`Message from ${socket.id} to room ${room}: ${text}`);
            io.to(room).emit('message',`${socket.id}: ${text}`);
        });
        socket.on('disconnect',() => {
            console.log(`${socket.id} disconnected`);
        });
    })
}
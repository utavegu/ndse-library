module.exports = (socket) => {
  const { id } = socket;
  const { roomName } = socket.handshake.query;
  socket.join(roomName);
  socket.on('message-to-room', (msg) => {
    msg.type = `book-id: ${roomName}`;
    socket.to(roomName).emit('message-to-room', msg);
    socket.emit('message-to-room', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
}
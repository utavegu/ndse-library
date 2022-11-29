const Book = require('../models/book');

module.exports = (socket) => {
  const { id } = socket;
  // console.info(`Socket connected: ${id}`);
  const { roomName } = socket.handshake.query;
  socket.join(roomName);
  socket.on('message-to-room', (msg) => {
    // Бесовщина... На счет точки с запятой еще в Дискорде почитай
    ;(async () => {
      try {
        const book = await Book.findById(roomName).select('-__v')
        const bookFeedbacks = book.feedbacks;
        const feedback = {
          author: msg.username,
          review: msg.text,
          date: msg.date,
        }
        bookFeedbacks.push(feedback);
        await Book.findByIdAndUpdate(
          roomName,
          { feedbacks: bookFeedbacks }
        )
      } catch (error) {
        console.error(error)
      }
    })()
    msg.type = `book-id: ${roomName}`;
    socket.to(roomName).emit('message-to-room', msg);
    socket.emit('message-to-room', msg);
  });

  socket.on('disconnect', () => {
    // console.info(`Socket disconnected: ${id}`);
  });
}
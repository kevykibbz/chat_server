const db = require('./db');


// Handle user-to-user chat message
const handleUserChat = (socket) => {
  socket.on('chatMessage', (messageData) => {
    // Save the message to the database
    const query = 'INSERT INTO messages (sender_id, recipient_id, message_text) VALUES (?, ?, ?)';
    const values = [messageData.senderId, messageData.recipientId, messageData.content];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error saving message to the database:', err);
      } else {
        console.log('Message saved to the database:', result);
      }
    });

    // Broadcast the message to other clients
    socket.broadcast.emit('chatMessage', messageData);
  });
};

module.exports = handleUserChat;

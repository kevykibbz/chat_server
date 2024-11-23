const db = require("./db");

// Handle thread-specific chat message
const handleThreadChat = (socket) => {
  socket.on("threadChatMessage", (messageData) => {
    // Save the message to the database in a specific thread
    const query ="INSERT INTO thread_messages (sender_id, thread_id, message_text,created_at) VALUES (?, ?, ?,NOW())";
    const values = [
      messageData.senderId,
      messageData.thread_id,
      messageData.message_text,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error saving message to the database:", err);
      } else {
        console.log("Message saved to the thread database:", result);
      }
    });
    // Broadcast the message to other clients in the thread
    socket.to(messageData.threadId).emit("threadChatMessage", messageData);
  });
};

module.exports = handleThreadChat;

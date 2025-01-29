const setupSocket = (io) => {
    // io.on('connection', (socket) => {
    //     console.log(`User connected: ${socket.id}`);
    
      socket.on('join-note', ({ noteId}) => {
        console.log(`User ${socket.id} joined note: ${noteId}`);
        socket.join(noteId);
        socket.to(noteId).emit('user-joined',{ userId : socket.id});
      });

      socket.on('edit-note', ({ noteId, content}) => {
        console.log('User edited note:', noteId);
        socket.to(noteId).emit('note-edited', {content, userId: socket.id});
      });


  socket.on('noteUpdated', (data) => {
    // Broadcast the updated note to all other clients
    socket.broadcast.emit('noteUpdated', data);
  });

    //   socket.on('disconnect', () => {
    //     console.log(`User disconnected: ${socket.id}`);
    //  });
    // });  
};

module.exports = setupSocket;
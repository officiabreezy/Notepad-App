const express = require('express');
const dotenv = require('dotenv').config();
const ConnectDB = require("./database/db");
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const startReminderScheduler = require('./services/reminderSchedular');
const http = require('http');
const setupSocket = require('./config/socket');
const path = require('path');
const {Server} = require('socket.io');
const cors = require('cors');


ConnectDB();
startReminderScheduler();
port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/note', noteRoutes);
app.use('/api/v1/reminder', reminderRoutes);
app.get('/', (req, res) => { 
  res.send('Hello World!')
 });

 io.on('connection', (socket) => {
  console.log('A user connected to the server:', socket.id);
  socket.emit('message', 'Welcome to the Socket.IO server!');
 });  
  // io.on('edit-note', (data) => {
  //   console.log('Edit note event received:', data);
  //   // Broadcast the event to all other connected clients
  //   socket.broadcast.emit('note-updated', data);
  // });

  io.on('disconnect', () => {
      console.log('A user disconnected:',socket.id);
  });
//  const io = setupSocket(server);

server.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});
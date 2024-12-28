const express = require('express');
const dotenv = require('dotenv').config();
const ConnectDB = require("./database/db");
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const startReminderScheduler = require('./services/reminderSchedular');

ConnectDB();
startReminderScheduler();
port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/note', noteRoutes);
app.use('/api/v1/reminder', reminderRoutes);
app.get('/', (req, res) => { 
  res.send('Hello World!')
 });
app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});


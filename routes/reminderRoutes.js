const express =  require('express');
const createReminder = require('../controller/reminderController');

const router = express.Router();

router.post('/createReminder', createReminder);

module.exports = router;
const express =  require('express');
const createReminder = require('../controller/reminderController');
const sendReminderSms = require('../services/smsAlert');
// const shareNoteViaEmail = require('../services/notification');

const router = express.Router();

router.post('/createReminder', createReminder);
router.post('/sendsms', sendReminderSms); 
// router.post('/shareNote', shareNoteViaEmail);


module.exports = router;
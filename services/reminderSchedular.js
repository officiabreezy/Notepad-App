const Reminder = require('../model/reminderModel');
const sendReminderEmail = require('./notification');
const nodemailer = require('nodemailer');

require('dotenv').config();

const checkReminders = async () => {
    try {
        const currrentTime = new Date();

        const reminders = await Reminder.find({
            reminderTime: {$lte: currrentTime}, 
            isSent: false
        });

        for(const reminder of reminders){
            const message = `Reminder: Don't forget your note!`;

        if(reminder.notificationType.includes('email')){
            await sendReminderEmail(reminder.userEmail, 'Reminder Notification', message);
        }
            reminder.isSent = true;
            await reminder.save();
        }
        
        // console.log('Reminders checked and sent');
    } catch (error) {
        console.error('error in reminder scheduler:', error.message);
        res.status(500).json({message:'Error in reminder scheduler'});
    }
};

const startReminderScheduler = () => {
    console.log('Starting scheduler>>>....');
    setInterval(checkReminders, 60 * 1000); // every minute
};

module.exports = startReminderScheduler;
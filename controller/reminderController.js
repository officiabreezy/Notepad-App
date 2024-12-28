const Reminder = require('../model/reminderModel');
const sendReminderEmail = require('../services/notification');

const createReminder = async (req, res) => {
    console.log('Request body:', req.body);

    const { noteId, userEmail, reminderTime } = req.body;

    if(!noteId || !userEmail || !reminderTime){
      res.status(400).json({ message:"missing required parameter"})
    };

    try {
       const reminder = new Reminder({
        noteId,
        userEmail, 
        reminderTime, 
        notificationType:"email",
       });

       await reminder.save();

    //    const info = await transporter.sendMail(maillOptions);
    //    console.log('email sent:', info.response);
    
       await sendReminderEmail(reminder.userEmail);

       res.status(200).json({ message: 'Reminder set successfully and email sent!', reminder });
    } catch (error) {
        console.error(error);
       res.status(500).json({ message:'failed to set reminder or send email', error: error.message });
    }
};

module.exports = createReminder;
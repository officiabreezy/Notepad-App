const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
   noteId : { type: mongoose.Schema.Types.ObjectId, ref:'Note', required: true },
   userEmail: { type: String, required: true },
   userPhone: { type: String},
   reminderTime : { type: Date, required: true},
   notificationType: { type: [String], enum :  ['email', 'sms'], required: true},
   isSent: { type: Boolean, default: false }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
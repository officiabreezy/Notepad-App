const nodemailer = require('nodemailer');	
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:process.env.user_email,
    pass:process.env.user_password
 },
});

const sendReminderEmail = async (userEmail) => {
    const mailOptions = {
    from: process.env.user_email,
    to: userEmail,
    subject: "Reminder for your Note",
    text: "if you didn't initiate this notification, kindly login to your note app for correct permissions....Thanks NoteAPP @2024."
};
 
try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:" + info.response);
} catch (error) {
    console.error("Error sending email: " + error.message);
}
};


module.exports = {sendReminderEmail};
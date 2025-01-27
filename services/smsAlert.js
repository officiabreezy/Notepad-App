const axios = require('axios');
const dotenv = require('dotenv').config();

const textApikey = process.env.TEXT_API_KEY;

const sendReminderSms = async (req, res) => {
    console.log("Request Body:", req.body);

    const {phoneNumber,  message} = req.body;

    try {
    if(!phoneNumber  || !message) {
        return res.status(400).json({message: "Please provide phone number and message"});
    }
    const response = await axios.post('https://textbelt.com/text', {
        phone: phoneNumber,
        message: message,
        key: textApikey
    });

    console.log("TextBelt Response:", response.data); 

    if (response.data.success) {
        return res.status(200).json({ message: 'SMS sent successfully', response: response.data });
    }
    else if (response.data.error === 'Out of quota') {
        return res.status(429).json({ message: 'SMS quota exceeded. Please try again later.' });
    } else {
        return res.status(400).json({ message: 'Failed to send SMS', error: response.data.error });
    }
} catch (error) {
    console.error(`Error sending SMS to ${phoneNumber}:`, error);
    return res.status(500).json({ message: "Failed to send SMS", error: error.message });
}
};

module.exports = sendReminderSms;
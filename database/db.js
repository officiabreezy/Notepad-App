const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ConnectDB = async () => {
    try {
       await mongoose.connect(process.env.mongoDB)
        console.log('Database connected')
    } catch (error) {
        console.log('Error connecting database:' + error.message)
    }
};
module.exports = ConnectDB;
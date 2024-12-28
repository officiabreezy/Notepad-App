const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const saltRounds = 10;

const userSignup = async (req, res) =>{
    const { username, email, password } = req.body;

    if(! username || ! email || ! password)
    return res.status(400).json({ message: 'All fields are required' });
    try {
       const existingUser = await User.findOne({ username: username}) 

       if(existingUser)
        return res.status(400).json({ message: 'details already exists' });

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(200).json({message: 'user created successfully'});
    } catch (error) {
        console.error("error creating user:" + error.message);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

const userLogin =  async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username});
        if(!user || !password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'password error'});
        }

        const token  = jwt.sign({userId: User.id}, process.env.Jwt_secret,{expiresIn: process.env.expiresIn});
        res.status(200).json({token});
    } catch (error) {
        console.error("error logging in user:" + error.message);
        return res.status(500).json({message:'Internal server error'});
    }
};

const requestOtp = async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ email: email});
      
      if(!user) {
        return res.status(400).json({ message: 'User not found' });
      }
    
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.user_email,
            pass: process.env.user_password,
        },
    });

    const  mailOptions = {
        from: process.env.user_email,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}. This OTP will expire in 10 minutes. Please don't share it with anyone else.`
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully'});

    } catch (error) {
       console.error('Error sending OTP: ' + error.message); 
       res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body;

    try {
        console.log("Input OTP:", otp);

        if (!otp || !newPassword) {
            return res.status(400).json({ message: 'OTP and new password are required' });
        }

        // Hash the OTP from request
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
        console.log("Hashed OTP from request:", hashedOtp);
        console.log("Current Time:", Date.now());

        // Query the user with hashed OTP and valid expiry
        const user = await User.findOne({
            otp: hashedOtp, 
            otpExpires: { $gt: Date.now() }
        });

       
        if (!user) {
           console.log('no user found');
           return res.status(400).json({ message: 'Invalid OTP' });
       }   

        console.log("User Found for Password Reset:", user.email);

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log("Server Time (UTC):", new Date().toISOString());
        console.log("Stored Expiry Time (UTC):", new Date(user?.otpExpires).toISOString());


        console.log("Password reset successfully for user:", user.email);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};


module.exports = {userSignup, userLogin, requestOtp, resetPassword}
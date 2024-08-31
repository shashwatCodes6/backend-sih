import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import otpModel from './db/models/otpModel.js';
import User from './db/models/userModel.js';
import cors from 'cors'

dotenv.config();


const { PORT, MongoURI , SMTP_PASS } = process.env;

const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173']
}))

mongoose.connect(MongoURI, {})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


app.use('/api/user', userRouter)

// for primary check of user details and sending otp
app.post('/sendOtp', async(req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !confirmPassword) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email' });
        return;
    }

    // Check if user with the same email already exists
    User.findOne({ email })
        .then(user => {
            if (user) {
                res.status(400).json({ error: 'User with the same email already exists' });
                return;
            }
        })
        .catch(err => res.status(500).json({ error: 'Error checking for user' }));
    
    // Check if password is valid
    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
    }

    if(password != confirmPassword){
        res.status(400).json({error : "The passwords does not match!"})
        return;
    }

    try {
        // First, delete all unused OTPs for the email
        await otpModel.deleteMany({ email });
        console.log("Existing OTPs deleted");
    
        // Send OTP
        let otp = sendOTP(email);
    
        // Save the new OTP in the table with email and time
        const newOtp = new otpModel({
            email,
            otp
        });
    
        await newOtp.save();
        res.status(200).json({ message: "OTP sent and saved successfully" });
    } catch (err) {
        console.error("Error processing OTP:", err);
        res.status(500).json({ error: "Internal server error" });
    }

});

// this is for the final signup and will activate only after the otp has been verified
// no checks are done here
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    const newUser = new User({
        name,
        email,
        password
    });

    // Save the user to the database
    newUser.save()
        .then(user => res.status(200).json({ message: 'User created successfully' }))
        .catch(err => res.status(500).json({ error: 'Error creating user' }));
});


const sendOTP = (email) => {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send the OTP to the specified email
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'healthcarelelo@gmail.com',
            pass: SMTP_PASS
        }
    });

    const mailOptions = {
        from: 'healthcarelelo@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending OTP:', error);
        } else {
            console.log('OTP sent:', info.response);
        }
    });

    return otp;
};

// To be used for checking purposes only
app.post('/send-otp', (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    // Send the OTP to the specified email
    const otp = sendOTP(email);

    res.status(200).json({ message: 'OTP sent successfully', otp });
});


app.post('/check-otp',(req,res)=>{
    const {email, otp} = req.body;
    // checking in the otp table for the corresponding otp
    otpModel.findOne({email})
    .then(OTP => {
        if(OTP.otp == otp && OTP.createdAt > Date.now() - 5*60*1000){
            res.status(200).json({message : "otp verified"});
        }
        else{
            res.status(400).json({error : "Otp did not match or has expired."});
        }
    })
    .catch(err => res.status(500).json({ error: 'Error checking for otp' }));
})



import chatbotRouter from './routes/chatbot.route.js';
import locationRouter from './routes/location.route.js';
import { userRouter } from './routes/user.routes.js';

app.use('/api/places', locationRouter)
app.use('/api/chatbot', chatbotRouter)


app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})
const express = require('express')
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import variables from .env file
const { PORT, MongoURI , SMTP_PASS } = process.env;
// Rest of the code...
const app = express();
app.use(express.json());

const mongoose = require('mongoose');


mongoose.connect(MongoURI, {})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create a model
const User = mongoose.model('User', userSchema);

// Example usage
const newUser = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
});

newUser.save()
    .then(user => console.log(user))
    .catch(err => console.log(err));



app.get('/', (req,res)=>{
    res.status(200).json({Backend : "Active"});
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are correct
    if (email === 'example@example.com' && password === 'password') {
        // Return user's name if credentials are correct
        const user = {
            name: 'John Doe'
        };
        res.status(200).json({ name: user.name });
    } else {
        // Return error message if credentials are incorrect
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/signup', (req, res) => {
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

    // Check if password is valid
    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
    }

    if(password != confirmPassword){
        res.status(400).json({error : "The passwords does not match!"})
        return;
    }
    // send otp
    let otp = sendOTP(email);
    // save the otp in a table with email and time


    res.status(200).json({ message: 'Details are valid. OTP sent to the email.'});
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
    if(otp == 123456){
        res.status(200).json({message : "otp verified"});
    }
    else{
        res.status(400).json({error : "Otp did not match"});
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})
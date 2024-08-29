const mongoose = require('mongoose');

// Define a schema
const otpSchema = new mongoose.Schema({
    email: String,
    otp: Number,
    createdAt: {
        type: Number,
        default: Date.now(),
        // expires: 5*60*1000    // 5 minutes
    }
});

// Create a model
const otpModel = mongoose.model('otpModel', otpSchema);
module.exports = otpModel;
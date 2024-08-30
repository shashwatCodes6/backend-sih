import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    email: String,
    otp: Number,
    createdAt: {
        type: Number,
        default: Date.now(),
        // expires: 5*60*1000    // 5 minutes
    }
});


const otpModel = mongoose.model('otpModel', otpSchema);
export default otpModel;
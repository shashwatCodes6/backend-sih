import mongoose from "mongoose";
import User from "./userModel.js";

const dailyMetricSchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    BP:{
        systolic:Number,
        diastolic:Number
    },
    BW:Number,
    HR:Number,
    BSL:Number,
    ECG:String,
    BO:Number,
});

const healthMetricSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    metrics:{
        type:[dailyMetricSchema],
    }
})

const healthMetrics=mongoose.model('healthMetrics',healthMetricSchema);
export default healthMetrics;
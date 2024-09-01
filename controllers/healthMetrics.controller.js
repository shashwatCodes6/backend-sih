import healthMetrics from '../db/models/metricsModel.js';


const update=async (userId,inputMetrics)=>{
    try {
        const today = new Date().setHours(0, 0, 0, 0);

    // Find if today's metrics already exist
    const oldMetrics = await healthMetrics.findOne({
        userId,
        'metrics.date': { $gte: today }
    });

    if (oldMetrics) {
        // If today's metrics exist, update them
        await healthMetrics.findOneAndUpdate(
            { userId, 'metrics.date': { $gte: today } },
            {
                $set: { 'metrics.$': inputMetrics }
            }
        );
        // console.log('Today\'s metrics updated successfully');
    } else {
        // If no metrics for today, add a new entry
        await healthMetrics.findOneAndUpdate(
            { userId },
            {
                $push: {
                    metrics: inputMetrics
                }
            },
            { new: true, upsert: true }
        );
        // console.log('New metrics added successfully');
    }

    return { updated: true };

    } catch (error) {
        console.log('error in updating metrics',error);
        return {updated:false};
    }
}
const fetch=async (userId)=>{
    try {
        const metrics=await healthMetrics.findOne({userId});
        console.log('ye tha db me',metrics.metrics);
        return metrics.metrics;
    } catch (error) {
        console.log("fetch krne me dikkat",error);
    }
}

const updateMetrics=async (req,res)=>{
    try {
        const metrics=req.body.metrics;
        // console.log(req.body)
        const {updated}=await update(req.body.user._id, metrics);
        // console.log(updated)
        if(updated){
            return res.status(200).json({message:"metrics updated successfully"});
        }else
            return res.status(500).json({message:"koi dikkat aa gyi lagta hai"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"koi dikkat aa gyi lagta hai"});
    }
}
const fetchMetrics=async (req,res)=>{
    try {
        const metrics=await fetch(req.body.user._id);
        console.log(req.body.user._id,metrics);
        return res.status(200).json({metrics:metrics});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"koi dikkat aa gyi lagta hai"});
    }
}
export {updateMetrics,fetchMetrics};
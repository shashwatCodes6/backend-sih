import healthMetrics from '../db/models/metricsModel.js';


const update=async (userId,inputMetrics)=>{
    try {
        const oldMetrics=await healthMetrics.findOne({userId});
        const today=newDate().setHours(0,0,0,0);

        const todayMetricsIndex=oldMetrics.metrics.findIndex(metric=>
            newDate(metric.date).setHours(0,0,0,0)===today
        );


        if(todayMetricsIndex!==-1){// aaj ke hi update krra user firse
            oldMetrics[todayMetricsIndex]=inputMetrics;
        }
        else{
            oldMetrics.metrics.push(inputMetrics);
        }

        await oldMetrics.save();
        console.log('metrics updated successfully');
        return {updated:true};
    } catch (error) {
        console.log('error in updating metrics',error);
        return {updated:false};
    }
}

const updateMetrics=async (req,res)=>{
    try {
        const {metrics}=req.body;
        const {updated}=updateMetrics(metrics);
        if(updated){
            return res.status(200).json({message:"metrics updated successfully"});
        }
        return res.status(500).json({message:"koi dikkat aa gyi lagta hai"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"koi dikkat aa gyi lagta hai"});
    }
}
export default updateMetrics;
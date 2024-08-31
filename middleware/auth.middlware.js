import jwt from 'jsonwebtoken';
import User from '../db/models/userModel.js';


export const verifyJWT = async (req, res, next) => {
    // console.log(req.header("Authorization"))
    let token = null
    if(req.header("Authorization")){
        token = req.header("Authorization").split(' ')[1];
    }
    if(!token){
        return res.status(400).json({message: "invalid req"})
    }

    // console.log(token);
    try{
        const response = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    }catch(err){
        return res.status(401).json({message: "invalid token"});
    }
    const dbID = jwt.decode(token);
    const user = await User.findById(dbID);
    if(!user){
        return res.status(401).json({message: "user doesnot exist"});
    }
    req.body.user = dbID;
    next();
}

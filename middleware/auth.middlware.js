import jwt from 'jsonwebtoken';
import User from '../db/models/userModel.js';


export const verifyJWT = async (req, res, next) => {
    const token = req.cookies.refreshToken.split(' ')[1];
    console.log(token)
    
    const response = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log(token, response);
    if(!response){
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

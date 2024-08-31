import jwt from 'jsonwebtoken'
import User from '../db/models/userModel.js';


const generateAccessandRefreshToken = async (user) => {
    try{
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }catch(err){
        return {message: "Error while generating access and refresh tokens"};
    }
}

const registerUser = async (req, res) => {
    const { name, email, password, age } =  req.body
    console.log(req.body);
    if(!name || !email || !password || !age){
        return res.status(403).json({message: "all fields are required"})
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        return res.status(409).json({ message: "user already exists" })
    }

        
    const user = await User.create({
        name,
        email,
        password,
        age
    })

    console.log(`user: ${user}`)
    return res.status(200).json({message: "ok"})
}

const loginUser = async (req, res) => {
    // require: username / email, password
    // check if username / email exist
    // compare pass to value stored
    // if not match, return error
    // else return access, refresh tokens
    const { email, password } = req.body;
    // console.log(req.body)
    if(!email){
        return res.status(401).json({message: "credentials are invalid"});
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(401).json({message:"user not found"});
    }
    const isPasswordValid = await user.isSamePassword(password);
    if(!isPasswordValid){
        return res.status(401).json({message:"passwords dont match"});
    }
    let accessToken, refreshToken;
    const response = await generateAccessandRefreshToken(user);

    if(response.accessToken && response.refreshToken) {
        accessToken = "Bearer " + response.accessToken
        refreshToken = "Bearer " + response.refreshToken
    }else{
        return res.status(500).json({message: response.message})
    }
    const options = {
        httpOnly: true,
        secure: true // bas server edit kr skta
    }
    // console.log(accessToken, refreshToken)
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({refreshToken, accessToken , message: "user logged in successfully!"});

}

const logoutUser = async (req, res) => {
    // validate JWT
    // delete refreshToken
    let token = null
    if(req.header("Authorization")){
        token = req.header("Authorization").split(' ')[1];
    }
    if(!token){
        return res.status(400).json({message: "invalid req"})
    }
    const dbID = jwt.decode(token);
    const user = await User.findById(dbID);
    if(user.refreshToken)
        user.refreshToken = undefined;
    await user.save();
    const options = {
        secure: true,
        httpOnly: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        message: "you logged out successfully"
    })
}

const refreshAccessToken = async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.refreshToken;
    const user = jwt.decode(token);
    const userDetails = await User.findById(user);
    if(userDetails.refreshToken !== token){
        return res.status(401).json({
            message: "invalid token"
        })
    }
    const options = {
        httpOnly: true,
        secure: true // bas server edit kr skta
    }
    const {accessToken, refreshToken} = await generateAccessandRefreshToken(userDetails);
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        refreshToken, accessToken, message: "success"
    })
}


export {registerUser, loginUser, logoutUser, refreshAccessToken}
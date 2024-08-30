import mongoose from "mongoose";
import bcrypt from 'bcrypt-updated'


const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        age: Number
    }, 
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.isSamePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);
export default User;
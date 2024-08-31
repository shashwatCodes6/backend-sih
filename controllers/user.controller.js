const loginUser = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email, password })
    .then(user => {
        if (user) {
            res.status(200).json({ name: user.name });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    })
    .catch(err => res.status(500).json({ error: 'Error checking for user' }));

}

const optSend = async(req, res) => {
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

    // Check if user with the same email already exists
    User.findOne({ email })
        .then(user => {
            if (user) {
                res.status(400).json({ error: 'User with the same email already exists' });
                return;
            }
        })
        .catch(err => res.status(500).json({ error: 'Error checking for user' }));
    
    // Check if password is valid
    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
    }

    if(password != confirmPassword){
        res.status(400).json({error : "The passwords does not match!"})
        return;
    }

    try {
        // First, delete all unused OTPs for the email
        await otpModel.deleteMany({ email });
        console.log("Existing OTPs deleted");
    
        // Send OTP
        let otp = sendOTP(email);
    
        // Save the new OTP in the table with email and time
        const newOtp = new otpModel({
            email,
            otp
        });
    
        await newOtp.save();
        res.status(200).json({ message: "OTP sent and saved successfully" });
    } catch (err) {
        console.error("Error processing OTP:", err);
        res.status(500).json({ error: "Internal server error" });
    }

}

export {
    loginUser,
    optSend
}
const User = require('../models/User');

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: password
        });
        
        await user.save();
        console.log("User registered: " + email);
        res.status(201).json({ message: "User registered successfully", user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt:', { email, password });
        
        const user = await User.findOne({ email: email, password: password });
        
        if (user) {
            console.log('Login successful for:', email);
            res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
        } else {
            console.log('Login failed: Invalid credentials for:', email);
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};

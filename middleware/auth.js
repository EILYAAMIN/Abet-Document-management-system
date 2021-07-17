const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    
    // Get the token from header
    const token = req.header('x-auth-token');

    // //Check if no token
    if (!token) {
        return res.status(401).json("Token not Found");
    }
    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = await User.findById(decoded.user.id);
        
        next();
        
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
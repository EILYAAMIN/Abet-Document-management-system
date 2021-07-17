module.exports = async function (req, res, next) {

    // Verify token
    try {
        if (req.user.role.toString() === "student") {
            console.log("Blocked access");
            return res.status(404);
        }

        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}
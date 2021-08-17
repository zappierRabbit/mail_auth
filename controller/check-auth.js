const jwt = require('jsonwebtoken');
const env = require("dotenv").config();

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err,auth) => {
        if(auth){
        req.userData = auth;
        next();
        } else {
            res.send("Token Expired")
        }
        });
    }catch(error) {
        res.status(401).json({
            message: "auth failed"
        });
        console.log(error);
    }
};
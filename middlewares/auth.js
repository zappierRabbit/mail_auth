const jwt = require('jsonwebtoken');
const env = require("dotenv").config();
const mongoose = require('mongoose');
const User = require('../models/userSchema');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err,auth) => {
        if(auth){
        req.userData = auth;
        User.findOne ({email: req.userData.email})
        .then(
            user =>{
                req.user=user
                if(req.user.role === "admin"){
                    next();
                }else{
                    res.send("not authorized")
                }
            }
        )
        .catch(
            err =>{
                console.log(err);
            }
        )
        } else {
            res.send("Token Expired")
        }
        });
    }catch(error) {
        res.status(401).json({
            message: "authorization failed"
        });
        console.log(error);
    }
};
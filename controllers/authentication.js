const bcrypt = require('bcrypt');
const validator = require('validator');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const utils  = require('../utilities/utils');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
var _ = require('lodash');

exports.signup = (req, res) => {
    let _errors = utils.validator(['name','email','password'], req.body);
    
    if (_errors.length > 0) {
        return res.send(_errors);
    }
    if(validator.isEmail(req.body.email)){
        User.find({email: req.body.email})
            .exec()
            .then(user =>{
                if(user.length >=1){
                    return res.status(409).json({
                        message: "mail exists"
                    })
                }
                else {
                    bcrypt.hash(req.body.password, 10, (err, hash)=>{
                        if(err){
                            return res.status(500).json({
                                error: err
                            })
                        }else {
                            const user = new User({
                                name: req.body.name,
                                email: req.body.email,
                                password:hash,
                                address:req.body.address,
                                phone:req.body.phone,
                                role: "user"
                            });
                            user
                            .save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message:"user created"
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
                                });
                            });
                        }
                    })
                }
            })
        }else{
            return res.status(500).json({
                message: 'Invalid Email'
            });
        }
}

//==================================================================================================================================================

exports.login = (req, res) => {
    let _errors = utils.validator(['email','password'], req.body);
    
    if (_errors.length > 0) {
        return res.send(_errors);
    }
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message : "Auth failed"
                });
            }else {
                req.user = user[0];
                bcrypt.compare(req.body.password, req.user.password, (err, result) =>{
                    if(result){
                        const token = jwt.sign(
                            {
                                email: req.body.email
                            },
                            process.env.JWT_KEY, 
                            {
                                expiresIn: '1h'
                            }
                            );
                        return res.status(200).json({
                            message : "Auth successful",
                            token : token
                        });
                    }else{
                        return res.status(401).json({
                        message : "Auth failed"
                    });
                }
                })
            }
            
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
}

//=======================================================================================================================

exports.resetPassword = (req, res) => {
    User.findOne ({token: req.body.token})
    .then(
        user => {
        req.user = user
        bcrypt.hash(req.body.np, 10, (err, hash) =>{
            req.user.password = hash;
            req.user.token = "null";
            req.user
            .save()
            .then(result => {
                res.json({
                    message:"Password changed successfully"
                })
            })
             .catch(err =>{
                    res.json({
                        message: "error"
                    })
                })
        }
        )
        }
    )
    .catch(err =>{
        res.json({
            message: "error"
        })
    })
}

//======================================================================================================================================================================================================

exports.resetRequest = async (req,res) => {
    const token = jwt.sign(
        {
            email: req.body.email,
        },
        process.env.JWT_KEY, 
        {
            expiresIn: '2h'
        }
        );

        User.findOne ({email: req.body.email})
    .then(
        user =>{
            console.log(user);
            user.token = token;
            user.save()
        }
    )
    .catch(
        err =>{
            console.log(err);
        }
    )

    try {
        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "0eb750d9800aea",
              pass: "727b99fdc0d62d"
            }
          });
        await transporter.sendMail({
            from: "abdullah.ahmad@optimusfox.com",
            to: "abdullahahmad0312@gmail.com",
            subject: "sending mail",
            text: `${token}`,
        });
        console.log("email sent sucessfully");
        res.json({
            message: "email sent!!"
        })
    } catch (error) {
        console.log(error, "email not sent");
        res.json({
            message:"error"
        })
    }
};
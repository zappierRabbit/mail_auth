const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const env = require("dotenv").config();
const User = require('../models/userSchema');
var _ = require('lodash');

exports.userController = (req, res)=>{
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
                phone:req.body.phone
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


exports.userControllerLogin = (req, res) => {
    bcrypt.compare(req.body.password, req.user.password, (err, result) =>{
        if(result){
            const token = jwt.sign(
                {
                    email: req.body.email,
                    name: req.body.name
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

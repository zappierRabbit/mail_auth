const jwt = require('jsonwebtoken');
const express = require('express');
const env = require("dotenv").config();
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');


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
    .catch(
        err =>{
            console.log(err);
        }
    )
}
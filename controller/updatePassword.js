const jwt = require('jsonwebtoken');
const env = require("dotenv").config();
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userSchema');

module.exports = (req, res) => {
            bcrypt.hash(req.body.np, 10, (err, hash) =>{
                req.user.password = hash;
                req.user
                .save()
                .then(result => {
                    res.json({
                        message:"Password updated successfully"
                    })
                })
                 .catch(err =>{
                        res.json({
                            message: "error"
                        })
                    })
            });
    
}
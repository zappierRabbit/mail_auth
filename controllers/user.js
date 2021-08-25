const bcrypt = require('bcrypt');
const validator = require('validator');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userSchema');
const utils  = require('../utilities/utils');
const jwt = require('jsonwebtoken');
var _ = require('lodash');

exports.fetUser = (req, res) => {
    User.findOne ({email: req.userData.email})
    .then(
        user =>{
            req.user=user
            res.json({
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                address: req.user.address
            })
        }
    )
    .catch(
        err =>{
            console.log(err);
        }
    )
}

//========================================================================================================================

exports.updatePassword = (req, res) => {
    User.findOne ({email: req.userData.email})
    .then(
        user =>{
            req.user=user
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
    )
    .catch(
        err =>{
            console.log(err);
        }
    )
}

//==========================================================================================================================

exports.displayPic = ((req, res) => {
    User.findOne ({email: req.userData.email})
    .then(
        user =>{
            console.log(req.file);
            user.displayPic = req.file.path;
            user.save()
            res.json({
                message: "image uploaded"
            })
        }
    )
    .catch(
        err =>{
            console.log(err);
        }
    )
});

//=============================================================================================================================================

exports.show = (req, res) => {
    User.findOne ({email: req.userData.email})
    .then(
        user =>{
            req.user=user
            res.json({
                didplayPic: req.user.displayPic
            })
        }
    )
    .catch(
        err =>{
            console.log(err);
        }
    )
}
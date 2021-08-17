const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const express = require('express');
const env = require("dotenv").config();
const mongoose = require('mongoose');
const User = require('../models/userSchema');



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


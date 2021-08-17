const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');


const User = require('../models/userSchema');
const { userController, userControllerLogin } = require('../controller/controller');
const utils  = require('../utils');
const checkAuth = require('../controller/check-auth'); 
const updatePassword = require('../controller/updatePassword');
const { resetRequest } = require('../controller/resetRequest');
const { resetPassword } = require('../controller/resetPassword');

router.post('/signup', (req, res, next)=>{
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
            }else next();
        })
    }else{
        return res.status(500).json({
            message: 'Invalid Email'
        });
    }
    
},userController);

router.post('/login', (req, res, next)=>{

    let _errors = utils.validator(['email','password'], req.body);
    
    if (_errors.length > 0) {
        return res.send(_errors);
    }

    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message : "Auth failed"
                });
            }else {
                req.user = user[0];
                next();
            }
            
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
}, userControllerLogin)

router.get('/api/users', checkAuth, (req, res) => {
    res.json({
        message : "users Fetched"
    })
})

router.post('/updatePassword', checkAuth, (req, res, next) => {
    User.findOne ({email: req.userData.email})
    .then(
        user =>{
            req.user=user
            next();
        }
    )
    .catch(
        err =>{
            console.log(err);
        }
    )
   
}, updatePassword);

router.post('/resetRequest', resetRequest);
router.post('/resetPassword', resetPassword);




// router.delete('./:userId', (req, res, next)=>{
//     User.remove({_id: req.params.id})
//         .exec()
//         .then(res => {
//             res.status(200).json({
//                 message: "user deleted"
//             });
//         })
//         .catch(err => {
//             return res.status(500).json({
//                 error: err
//             });
//         });
// });

module.exports = router;
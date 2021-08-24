const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validator = require('validator');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
    });



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
        .then(user => {
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
router.post('/upload', checkAuth, upload.single('displayPic'), (req, res) => {
    User.findOne ({email: req.userData.email})
    .then(
        user =>{
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

router.get('/show', checkAuth, (req, res) => {
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
})






module.exports = router;
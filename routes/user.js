const express = require('express');
const router = express.Router();

const authentication = require('../controllers/authentication');
const user = require('../controllers/user');

const checkAuth = require('../middlewares/check-auth'); 
const { upload } = require('../middlewares/upload');

router.post('/signup', authentication.signup );
router.post('/login', authentication.login);
router.post('/resetRequest', authentication.resetRequest);
router.post('/resetPassword', authentication.resetPassword);
router.post('/uploadPic', checkAuth,upload.single('displayPic'),user.displayPic);
router.post('/updatePassword', checkAuth, user.updatePassword);

router.get('/api', checkAuth, user.fetUser);
router.get('/show', checkAuth, user.show);





module.exports = router;
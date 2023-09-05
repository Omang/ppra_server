const express = require('express');

const router = express.Router();

const {uploadfile, registeruser, loginuser, logout, addStuff, getUser, sendmail, updateContractor} = require('../controllers/UserController');
const { authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator } = require('../middlewares/authMiddleware');

router.post('/register', registeruser);
router.post('/login', loginuser);
router.put('/updatecontractor', authMiddleware, updateContractor);
router.post('/addstuff', authMiddleware, isAdmin, addStuff);
router.post('/logout', authMiddleware, logout);
router.get('/getuser/:id', authMiddleware, getUser);
router.post('/mailsend', sendmail);
router.post('/uploadfile', uploadfile);


module.exports = router;
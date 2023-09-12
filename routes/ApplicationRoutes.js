const express = require('express');
const multer = require('multer');

const router = express.Router();

const {verifyreturn, appverify, appapprove, officergetapp, appAll, uploadPhoto, newApplication, viewcodes, getApplication, updateApplication, applicationpayment, licensepayment} = require('../controllers/ApplicationController');
const {authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator} = require('../middlewares/authMiddleware');
const photosMiddleware = multer({dest:'uploads/'});

router.post('/newapp', authMiddleware, newApplication);
router.post('/viewcodes', authMiddleware, viewcodes);
router.post('/getapp', authMiddleware, getApplication);
router.put('/updateapplication', authMiddleware, updateApplication);
router.put('/apppay', authMiddleware, applicationpayment);
router.put('/licensepay', authMiddleware, licensepayment);
router.post('/upload',photosMiddleware.array('photos', 100), uploadPhoto);
router.post('/allapps', appAll);
router.put('/appreturntouser', authMiddleware, verifyreturn);
router.put('/verifyapp', authMiddleware, appverify);
router.put('/approveapp', authMiddleware, appapprove);
router.post('/officergetapp', authMiddleware, officergetapp);


module.exports = router;

const express = require('express');

const router = express.Router();

const {newApplication, viewcodes, getApplication, updateApplication, applicationpayment, licensepayment} = require('../controllers/ApplicationController');
const {authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator} = require('../middlewares/authMiddleware');

router.post('/newapp', authMiddleware, newApplication);
router.post('/viewcodes', authMiddleware, viewcodes);
router.post('/getapp', authMiddleware, getApplication);
router.put('/updateapplication', authMiddleware, updateApplication);
router.put('/apppay', authMiddleware, applicationpayment);
router.put('/licensepay', authMiddleware, licensepayment);

module.exports = router;

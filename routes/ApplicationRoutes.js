const express = require('express');

const router = express.Router();

const {newApplication, viewcodes, updateApplication, normalpayment, expresspayment} = require('../controllers/ApplicationController');
const {authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator} = require('../middlewares/authMiddleware');

router.post('/newapp', authMiddleware, newApplication);
router.post('/viewcodes', authMiddleware, viewcodes);
router.put('/updateapplication', authMiddleware, updateApplication);
router.put('/normalpay', authMiddleware, normalpayment);
router.put('/expresspay', authMiddleware, expresspayment);

module.exports = router;

const express = require('express');

const router = express.Router();

const {appverifyreturn, createsubcodes, createCode, createcat, appevaluationreturn, appassessmentreturn, companycodesview, appverify, appassesment, appevaluation, appview, pendingview, assesmentview, evaluationview, adjudicationview } = require('../controllers/AdminController');

const {authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator} = require('../middlewares/authMiddleware');

router.post('/office/verifyreturn', authMiddleware, isVerifier, appverifyreturn);
router.post('/office/appverify' , authMiddleware, isVerifier, appverify);
router.post('/office/evaluationreturn' , authMiddleware, isEvaluator, appevaluationreturn);
router.post('/office/appevaluation', authMiddleware, isEvaluator, appevaluation);
router.post('/office/assessmentreturn', authMiddleware, isAssessor, appassessmentreturn );
router.post('/office/appassessment', authMiddleware, isAssessor, appassesment);
router.post('/codeview', authMiddleware, companycodesview);
router.post('/createcat', authMiddleware, createcat);
router.post('/createcode', authMiddleware, createCode);
router.post('/createsubcode', authMiddleware, createsubcodes);


module.exports = router;

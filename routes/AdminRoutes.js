const express = require('express');

const router = express.Router();

const {getallcodes, getsubcodes, appverifyreturn, createsubcodes, createCode, createcat, appevaluationreturn, appassessmentreturn, companycodesview, appverify, appassesment, appevaluation, appview, pendingview, assesmentview, evaluationview, adjudicationview } = require('../controllers/AdminController');

const {authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator} = require('../middlewares/authMiddleware');

router.post('/office/verifyreturn', authMiddleware, appverifyreturn);
router.post('/office/appverify' , authMiddleware, appverify);
router.post('/office/evaluationreturn' , authMiddleware, appevaluationreturn);
router.post('/office/appevaluation', authMiddleware, appevaluation);
router.post('/office/assessmentreturn', authMiddleware, appassessmentreturn );
router.post('/office/appassessment', authMiddleware, appassesment);
router.post('/codeview', authMiddleware, companycodesview);
router.post('/createcat', authMiddleware, createcat);
router.post('/createcode', authMiddleware, createCode);
router.post('/createsubcode', authMiddleware, createsubcodes);
router.post('/getcode', getallcodes);
router.post('/getsubcodes', getsubcodes);


module.exports = router;

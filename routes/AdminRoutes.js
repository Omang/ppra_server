const express = require('express');

const router = express.Router();

const {onecompany, allcompanies, addtheuser, appuser, getappusers, getallcodes, getsubcodes, appverifyreturn, createsubcodes, createCode, createcat, appevaluationreturn, appassessmentreturn, companycodesview, appverify, appassesment, appevaluation, appview, pendingview, assesmentview, evaluationview, adjudicationview } = require('../controllers/AdminController');

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
router.post('/appusers', authMiddleware, getappusers);
router.post('/appuser', authMiddleware, appuser);
router.post('/adduser', authMiddleware, addtheuser);
router.post('/allcompanies', authMiddleware, allcompanies);
router.post('/singlecompany', authMiddleware, onecompany);


module.exports = router;

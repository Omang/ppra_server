const express = require('express');
const router = express.Router();
const {updatedirector, addnewdirector, getCompany, addProjects, newCompany, updateCompany} = require('../controllers/CompanyController');
const { authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator } = require('../middlewares/authMiddleware');

router.post('/addcompany', authMiddleware, newCompany);
router.put('/updatedirectors', authMiddleware, updatedirector);
router.post('/addnewdirector', authMiddleware, addnewdirector);
router.post('/getcompany', authMiddleware, getCompany);
router.put('/addprojects', authMiddleware, addProjects);
router.put('/updatecompany', authMiddleware, updateCompany);


module.exports = router;
const express = require('express');
const router = express.Router();
const {allcompanies, onecompany, addbankstatements, addtransactions, companyemployees, updatedirector, addnewdirector, getCompany, addProjects, newCompany, updateCompany} = require('../controllers/CompanyController');
const { authMiddleware, isAdmin, isVerifier, isAssessor, isEvaluator } = require('../middlewares/authMiddleware');

router.post('/addcompany', authMiddleware, newCompany);
router.put('/updatedirectors', authMiddleware, updatedirector);
router.post('/addnewdirector', authMiddleware, addnewdirector);
router.post('/getcompany', authMiddleware, getCompany);
router.put('/addprojects', authMiddleware, addProjects);
router.put('/updatecompany', authMiddleware, updateCompany);
router.post('/getcompanyemployees', companyemployees);
router.post('/addbankstatements', addbankstatements);
router.post('/addtransactions', addtransactions);
router.post('/onecompany', onecompany);
router.post('/allcompanies', allcompanies)


module.exports = router;
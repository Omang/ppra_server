const Application = require('../models/ApplicationModel');
const Company = require('../models/CompanyModel');
const Auth = require('../models/AuthModel');
const Comm = require('../models/PaymentModel');
const Codes = require('../models/CodeModel');
const Cat = require('../models/CategoryModel');
const Subcodes = require('../models/SubcodesModel');

//get all companies

const allcompanies = async(req, res)=>{

    try{

        const allitems = await Company.find();
        res.json(allitems);

    }catch(e){
        throw new Error(e);
    }

}

//get all applications
const allapplications =async(req, res)=>{

    try{
        const allitems = await Application.find().populate('Subcodes');
        res.json(allitems);

    }catch(e){
        throw new Error(e);
    }

}

module.exports ={allcompanies, allapplications};
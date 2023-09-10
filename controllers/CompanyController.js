const Company = require('../models/CompanyModel');
const Project = require('../models/ProjectModel');
const Director = require('../models/DirectorsModel');
const Comm = require('../models/ComModel');

const updateCompany = async(req, res)=>{
    const {company_id,
        company_assets,
        company_type,
        company_ownership,
        bank_name,
        bank_branch,
        bank_number,
        bank_letter,
        email,
        phonenumber,
        postal_address,
        physical_address,
        company_location
      } = req.body;

      try{

        const companyUpdate = await Company.findByIdAndUpdate(company_id, {
            company_assets: company_assets,
            company_type: company_type,
            company_ownership: company_ownership,
            company_bank: {
                account_name: bank_name,
                account_branch: bank_branch,
                account_number: bank_number,
                bank_letter : bank_letter         


                
            },
            company_contacts:{
                email: email,
                phonenumber: phonenumber,
            },
            company_address:{
                postal_address: postal_address,
                physical_address: physical_address
            },
            company_location: company_location
                  
        }, {new:true});

        res.json(companyUpdate);

      }catch(e){
        throw new Error(e);
      }

}

const newCompany = async(req, res)=>{
    const {auth_id,
           company_name,
           company_cipa,
           company_directors,
           company_assets,
           company_type,
           company_ownership,
           bank_name,
           bank_branch,
           bank_number,
           bank_letter,
           email,
           phonenumber,
           postal_address,
           physical_address,
           company_location
         } = req.body;
    try{
        //first save strings and objects

        const addcompany = await Company.create({
            auth_id: auth_id,
            company_name: company_name,
            company_cipa: company_cipa,
            company_assets: company_assets,
            company_type: company_type,
            company_ownership: company_ownership,
            company_bank: {
                account_name: bank_name,
                account_branch: bank_branch,
                account_number: bank_number,
                bank_letter : bank_letter
            },
            company_contacts:{
                email: email,
                phonenumber: phonenumber,
            },
            company_address:{
                postal_address: postal_address,
                physical_address: physical_address
            },
            company_location: company_location

        });

      //loop and save and push ids
      if(addcompany){
         for(let i = 0;  i < company_directors.length; i++){

            const {fullname, percent_own, nationality, identity_attachment, postal_address, physical_address}= company_directors[i];
            const addone = await Director.create({
                fullname: fullname,
                nationality: nationality,
                percent_own: percent_own,
                identity_attachment: identity_attachment,
                postal_address: postal_address,
                physical_address: physical_address
            })
            if(addone){
                await Company.findByIdAndUpdate(addcompany._id.toString(), {
                    $push: {
                        company_directors: addone._id.toString()
                    }
                })
            }

         }
         const thecompany = await Company.findById(addcompany._id.toString());

         res.json(thecompany);
      }

    }catch(e){
        throw new Error(e);
    }
}

const addProjects = async(req, res)=>{
    const {company_id, projects} = req.body;
    try{

        for(let i = 0; i < projects.length; i++){
            const {project_name, project_description, project_for, project_reference} = projects[i];
            const addproject = await Project.create({
                 project_name: project_name,
                 project_description: project_description,
                 project_for: project_for,
                 project_reference: project_reference
            })
            if(addproject){
                await Company.findByIdAndUpdate(company_id, {
                    $push: {
                        company_projects: addproject._id.toString()
                    }
                })
            }
        }
      
        const getupdated = await Company.findById(company_id);

        res.json(getupdated);

    }catch(e){
        throw new Error(e);
    }
}

const getCompany = async(req, res)=>{
    console.log(req.body);
    const {auth_id} = req.body;

    try{

        const companyget = await Company.findOne({auth_id: auth_id});
        res.json(companyget);

    }catch(e){
        throw new Error(e);
    }
}

const addnewdirector = async(req, res)=>{
    const {company_id, fullname, percent_own, nationality, identity_attachment, postal_address, physical_address} = req.body;

    try{

        const createnew = await Director.create({
            fullname: fullname,
            nationality: nationality,
            percent_own: percent_own,
            identity_attachment: identity_attachment,
            postal_address: postal_address,
            physical_address: physical_address
        })
        if(createnew){
            await Company.findByIdAndUpdate(company_id, {
                $push: {
                    company_directors: createnew._id.toString()
                }
            })
            res.json(createnew);
        }
        
    }catch(e){
        throw new Error(e);
    }
}

const updatedirector = async(req, res)=>{
    const {director_id, fullname, percent_own, nationality, identity_attachment, postal_address, physical_address} = req.body;

    try{

        const directorupdate = await Director.findByIdAndUpdate(director_id, {
            fullname: fullname,
            nationality: nationality,
            percent_own: percent_own,
            identity_attachment: identity_attachment,
            postal_address: postal_address,
            physical_address: physical_address
        })
        
        res.json(directorupdate);

    }catch(e){
        throw new Error(e);
    }
}

module.exports = {updatedirector, addnewdirector, getCompany, addProjects, newCompany, updateCompany};

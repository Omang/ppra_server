const Application = require('../models/ApplicationModel');
const Company = require('../models/CompanyModel');
const Auth = require('../models/AuthModel');
const Comm = require('../models/PaymentModel');
const Codes = require('../models/CodeModel');
const Cat = require('../models/CategoryModel');
const Subcodes = require('../models/SubcodesModel');
const {sendemail} = require('../config/MailConnect');

const appuser = async(req, res)=>{
    const {appuser_id} = req.body;
    try{

        const getone = await Auth.findById(appuser_id);

        res.json(getone);

    }catch(e){
        throw new Error(e);
    }
}

const getappusers = async(req, res)=>{
    const {auth_id} = req.body;
    
    try{

      const getthem = await Auth.find(
        { role: { $ne: 'contractor' } }
        )
      res.json(getthem);

    }catch(e){
        throw new Error(e);
    }
}

const createcat = async(req, res)=>{
    const {cat} = req.body;

    try{

        const newone = await Cat.create({
            cat_name: cat
        })
        res.json(newone);

    }catch(e){
        throw new Error(e);
    }

}
const createCode = async(req, res)=>{
    const {cat_id, code} = req.body;
    try{

        const newone = await Codes.create({
           cat_id: cat_id,
           code_name: code 
        })

        res.json(newone);

    }catch(e){

        throw new Error(e);

    }
}

const createsubcodes = async(req, res)=>{
    const {code_id, subcodes} = req.body;
    try{

        for(let i =0; i < subcodes.length; i++){
            const {subcode_name, subcode_description, subcode_requirement, subcode_level} = subcodes[i];
            const savecode = await Subcodes.create({
                subcode_name: subcode_name,
                subcode_description: subcode_description,
                subcode_requirement: subcode_requirement,
                subcode_level: subcode_level
            });
            if(savecode){
                const addtocode = await Codes.findByIdAndUpdate(code_id, {
                    $push:{
                        subcodes: savecode._id.toString()
                    }
                })
            }
        }

        const addedsubcodes = await Codes.findById(code_id).populate('subcodes');

        res.json(addedsubcodes);


    }catch(e){
        throw new Error(e);
    }
}
const appverifyreturn = async(req, res)=>{
    const {app_id, user_id, thehead, themessage} = req.body;

    try{

        const createsms = await Comm.create({
            message_type: thehead,
            themessage: themessage
        });
        if(createsms){
            //send email and push to user
            const updateuser = await Auth.findByIdAndUpdate(user_id, {
                $push:{
                    messages: createsms._id.toString()
                }
            },{new:true});
            const updateappsms = await Application.findByIdAndUpdate(app_id, {
                $push:{
                    verification_comments: createsms._id.toString()
                }
            },{new:true})
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: updateuser?.email,
                subject: thehead,
                text:  'One of your codes need attention. Go to your Dashboard, view codes and fix it'
              };
              
               sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json(error);
                }else{
                  res.json({message: 'Ok'});
                }
              })
        }

    }catch(e){
        throw new Error(e);
    }
}
const appassessmentreturn = async(req, res)=>{
    const {app_id, user_id, thehead, themessage} = req.body;

    try{
        const createsms = await Comm.create({
            message_type: thehead,
            themessage: themessage
        });
        if(createsms){
            //send email and push to user
            const updateuser = await Auth.findByIdAndUpdate(user_id, {
                $push:{
                    messages: createsms._id.toString()
                }
            },{new:true});
            const updateappsms = await Application.findByIdAndUpdate(app_id, {
                $push:{
                    assesment_comments: createsms._id.toString()
                }
            },{new:true})
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: updateuser?.email,
                subject: thehead,
                text:  themessage
              };
              
               sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json(error);
                }else{
                  res.json({message: 'Ok'});
                }
              })
        }


    }catch(e){
        throw new Error(e);
    }
}
const appevaluationreturn = async(req, res)=>{
    const {app_id, user_id, thehead, themessage} = req.body;

    try{
        const createsms = await Comm.create({
            message_type: thehead,
            themessage: themessage
        });
        if(createsms){
            //send email and push to user
            const updateuser = await Auth.findByIdAndUpdate(user_id, {
                $push:{
                    messages: createsms._id.toString()
                }
            },{new:true});
            const updateappsms = await Application.findByIdAndUpdate(app_id, {
                $push:{
                    evaluation_comments: createsms._id.toString()
                }
            },{new:true})
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: updateuser?.email,
                subject: thehead,
                text:  themessage
              };
              
               sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json(error);
                }else{
                  res.json({message: 'Ok'});
                }
              })
        }


    }catch(e){

    }
}
const appverify = async(req, res)=>{
  
  const  {app_id, user_id, auth_id} = req.body;
  try{

    const verifypass = await Application.findByIdAndUpdate(app_id,{
        verification_by: user_id,
        pendingverification: false
    });
    //send sms to company for payment
    if(verifypass){

        const updateforpaycodes = await Company.findOneAndUpdate({auth_id: auth_id}, {
            $push:{
                topayment_codes: verifypass._id.toString()
            }
        },{new:true});

        if(updateforpaycodes.company_codes.length === updateforpaycodes.topayment_codes.length){
           
            const createsms = await Comm.create({
                message_type: "Application and Codes Payment",
                themessage: "Please pay application fees"
            });
            if(createsms){
                //send email and push to user
                const updateuser = await Auth.findByIdAndUpdate(auth_id, {
                    $push:{
                        messages: createsms._id.toString()
                    }
                },{new:true});

                var mailOptions = {
                    from: 'manwish01@gmail.com',
                    to: updateuser?.email,
                    subject: "Application and Codes Payment",
                    text:  "Please pay application fees"
                  };
                  
                   sendemail(mailOptions, function(error,info){
                    if(error){
                      console.log(error);
                      res.json(error);
                    }else{
                      res.json({message: 'Ready'});
                    }
                  })
            } 

        }else{
            res.json({message: "Verified"});
        }


    }
    

  }catch(e){
    throw new Error(e);
  }

}

const appassesment = async(req, res)=>{

    const {app_id, user_id, auth_id, thehead, themessage} = req.body;
    try{

        
         const addcomment = await Comm.create({
                message_type: thehead,
                themessage: themessage
            })
        if(addcomment){
            
         const appassess = await Application.findByIdAndUpdate(app_id, {
            pendingassesment: false,
            assesment_by: user_id,
            $push:{assessment_comments: addcomment._id.toString()}
          })

          res.json({message: "Assessed Ok"});

        }

    }catch(e){
        throw new Error(e);
    }
   
}

const appevaluation = async(req, res)=>{

    const {app_id, user_id, thehead, themessage} = req.body;
    try{

        const addcomment = await Comm.create({
                message_type: thehead,
                themessage: themessage
            })
        if(addcomment){
            
         const appassess = await Application.findByIdAndUpdate(app_id, {
            pendingevaluation: false,
            evaluation_by: user_id,
            $push:{evaluation_comments: addcomment._id.toString()}
          })
          
          res.json(appassess);

        } 

    }catch(e){
        throw new Error(e);
    }

}

const appview = async(req, res)=>{
    const {app_id} = req.body;
    try{
        //verifier view
        const viewapp = await Application.findById(app_id).populate('company_id');

        res.json(viewapp);

    }catch(e){
        throw new Error(e);
    }

}
const pendingview = async(req, res)=>{

}
const assesmentview = async(req, res)=>{
    const {app_id, user_id, thehead, themessage} = req.body;
    try{
      //populate verifier,  and his/her comments
      const viewapp = await Application.findById(app_id).populate('company_id'); 

    }catch(e){
        throw new Error(e);
    }


}
const evaluationview = async(req, res)=>{
    const {app_id, user_id, thehead, themessage} = req.body;
    try{
       //populate assessment name and comments
       const viewapp = await Application.findById(app_id).populate('company_id'); 

    }catch(e){
        throw new Error(e);
    }


}

const adjudicationview = async(req, res)=>{
    const {user_id} = req.body;
    try{
        //view company with all applied codes
        const viewcompany = await Company.findOne({auth_id: user_id}).populate('company_codes');

        res.json(viewcompany);
        

    }catch(e){
        throw new Error(e);
    }


}
const companycodesview = async(req, res)=>{
    const {auth_id} = req.body;
    const allcodes = [];
    try{
        //view company with all applied codes
        const viewcompany = await Company.findOne({auth_id: auth_id}).populate('company_codes');
        if(viewcompany){
            for(let i =0; i < viewcompany.company_codes.length; i++){

                const { _id, subcode, subcode_level, attachment} = viewcompany.company_codes[i];
                const {subcode_name} = await Subcodes.findById(subcode);
                allcodes.push({ app_id: _id, name: subcode_name, subcode_level, attachment});

            }
            res.json(allcodes);

        }  
        
        

    }catch(e){
        throw new Error(e);
    }


}
const getallcodes = async(req, res)=>{
    const {id}=req.body;
    try{

        const getall = await Codes.find();

        res.json(getall);

    }catch(e){
        throw new Error(e);
    }
}
const getsubcodes = async(req, res)=>{
    const {code_id}=req.body;
    try{

        const getsubcodev = await Codes.findById(code_id).populate('subcodes');

        res.json(getsubcodev.subcodes);

    }catch(e){
        throw new Error(e);
    }
}
const addtheuser = async(req, res)=>{
    console.log(req.body);
    const {firstname, lastname, role, password, mobilenumber, email} = req.body;
    try{

       const onefind = await Auth.findOne({email: email});
       if(onefind){
        res.json({message: 'user exists'})
       }else{
         const adduser = await Auth.create({
            firstname:firstname,
            lastname: lastname,
            password: password,
            mobilenumber: mobilenumber,
            role: role,
            email:email
        });
        res.json(adduser);
       }

    }catch(e){
        throw new Error(e);
    }

}

const allcompanies = async(req, res)=>{
    const {auth_id} = req.body;
    try{

        const themall = await Company.find();
        res.json(themall);

    }catch(e){
        throw new Error(e);
    }
}
const onecompany = async(req, res)=>{
    const {company_id} = req.body;
    try{

        const getit = await Company.findById(company_id).populate('company_directors');
        res.json(getit);

    }catch(e){
        throw new Error(e);
    }
}
const getapproveapp = async(req, res)=>{
    const {auth_id} = req.body;
    try{

        const findit = await Application.findOne({auth_id: auth_id}).populate('application_approveby');
        if(findit.application_approved){
            res.json(findit);
        }else{
            res.json({message: 'no approved applications'});
        }

    }catch(e){
        throw new Error(e)
    }
}

module.exports ={getapproveapp, onecompany, allcompanies, addtheuser, appuser, getappusers, getallcodes, getsubcodes, appverifyreturn, createsubcodes, createCode, createcat, appevaluationreturn, appassessmentreturn, companycodesview, appverify, appassesment, appevaluation, appview, pendingview, assesmentview, evaluationview, adjudicationview };
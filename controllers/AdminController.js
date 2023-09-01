const Application = require('../models/ApplicationModel');
const Company = require('../models/CompanyModel');
const Auth = require('../models/AuthModel');
const Comm = require('../models/PaymentModel');
const Codes = require('../models/CodeModel');
const Cat = require('../models/CategoryModel');
const Subcodes = require('../models/SubcodesModel');
const {sendemail} = require('../config/MailConnect');

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

        if(updateforpaycodes.company_codes.length == updateforpaycodes.topayment_codes.length){
           
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
    const {user_id} = req.body;
    try{
        //view company with all applied codes
        const viewcompany = await Company.findOne({auth_id: user_id}).populate('company_codes');

        res.json(viewcompany);
        

    }catch(e){
        throw new Error(e);
    }


}

module.exports ={appverifyreturn, createsubcodes, createCode, createcat, appevaluationreturn, appassessmentreturn, companycodesview, appverify, appassesment, appevaluation, appview, pendingview, assesmentview, evaluationview, adjudicationview };
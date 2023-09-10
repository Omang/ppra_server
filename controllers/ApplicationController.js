const Company = require('../models/CompanyModel');
const Application = require('../models/ApplicationModel');
const Payment = require('../models/PaymentModel');
const Comm = require('../models/ComModel');
const {sendemail} = require('../config/MailConnect');
const Auth = require('../models/AuthModel');
const Subcodes = require('../models/SubcodesModel');
const multer = require('multer');
const fs = require('fs');

const uploadPhoto = async(req,res)=>{
    const uploadedFiles = [];
   for (var i = 0; i < req.files.length; i++) {
      const {path, originalname}= req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.'+ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads\\', ''));

   }
    res.json(uploadedFiles);  
}

const applicationpayment = async(req, res)=>{

    const {auth_id} = req.body;

    try{
           const payapp = await Application.findOneAndUpdate({auth_id:auth_id},{
            application_paid: true
           },{new:true});


            if(payapp){
            const finduserandupdate = await Auth.findById(auth_id);
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: finduserandupdate?.email,
                subject: 'Payment Successful',
                text:  "Your payment has been successful, your application is on the next stage. will take 2 weeks"
              };
              
              sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json(error);
                }else{
                  res.json({message: 'Payment Successful'});
                }
              })
            }
        
        

       
    }catch(e){

        throw new Error(e);

    }

}

const licensepayment = async(req, res)=>{

    const {auth_id} = req.body;

    try{
           const payapp = await Application.findOneAndUpdate({auth_id:auth_id},{
            license_paid: true
           },{new:true});


            if(payapp){
            const finduserandupdate = await Auth.findById(auth_id);
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: finduserandupdate?.email,
                subject: 'Payment Successful',
                text:  "Your payment has been successful, your application is on the next stage. will take 2 weeks"
              };
              
              sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json(error);
                }else{
                  res.json({message: 'Payment Successful'});
                }
              })
            }
        
        

       
    }catch(e){

        throw new Error(e);

    }

}

const newApplication = async(req, res)=>{
    const {auth_id, application_type, application_cost, application_attachment} = req.body;

    try{
        
        const addcode = await Application.create({
            auth_id: auth_id,
            application_type: application_type,
            application_cost: application_cost,
            application_attachment: application_attachment
        });

        if(addcode){

              const sms = await Comm.create({
                    messsage_type: 'New Application at Water Department',
                    themessage: "New Application made by you. Waiting verification..will take 2 days to verify"
                })
                if(sms){
                   const sendtouser = await Auth.findByIdAndUpdate(auth_id, {
                        $push:{
                            messages: sms._id.toString()
                        }
                    },{new:true});
                    var mailOptions = {
                        from: 'manwish01@gmail.com',
                        to: sendtouser?.email,
                        subject: 'New Application at Diamond Hub',
                        text:  "New Application maked by you. Waiting verification..will take 2 days to verify documents"
                      };
                      
                      sendemail(mailOptions, function(error,info){
                        if(error){
                          console.log(error);
                          res.json(error);
                        }else{
                          res.json(addcode);
                        }
                      })

                }
            }

    }catch(e){
        throw new Error(e);
    }

}

const updateApplication = async(req, res)=>{
    const {app_id, attachment, subcode_level} = req.body;
    try{

        const updateapp = Application.findByIdAndUpdate(app_id, {
            attachment: attachment,
            subcode_level: subcode_level
        })

        res.json(updateapp);

    } catch(e){
        throw new Error(e);
    }
}
const viewcodes =async(req, res)=>{
    const {auth_id} = req.body;
    
    try{

       const getuserapps = await Application.find({auth_id: auth_id});

       res.json(getuserapps); 

    }catch(e){
        throw new Error(e);
    }

}
const getApplication = async(req, res)=>{
    const {app_id} = req.body;
    try{
        const getApp = Application.findById(app_id);

        res.json(getApp)

    }catch(e){
        throw new Error(e);
    }
}

module.exports ={uploadPhoto, getApplication, newApplication, viewcodes, updateApplication, applicationpayment, licensepayment};

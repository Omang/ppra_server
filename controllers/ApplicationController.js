const Company = require('../models/CompanyModel');
const Application = require('../models/ApplicationModel');
const Payment = require('../models/PaymentModel');
const Comm = require('../models/ComModel');
const {sendemail} = require('../config/MailConnect');
const Auth = require('../models/AuthModel');
const Subcodes = require('../models/SubcodesModel');
const multer = require('multer');
const fs = require('fs');
const stripe = require('stripe')("sk_test_tUmUpgvfbpuVPlZae9f23GSa00RYQd7TBP");

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

const getkey = async(req, res)=>{
    const {id} = req.body;
    try{

        res.json({publish_key: process.env.PUBLISH_KEY})

    }catch(e){
        throw new Error(e);
    }
}

const applicationpayment = async(req, res)=>{

    const {id} = req.body;

    console.log(req.body);

    try{
        
      const getapp = await Application.findById(id);

      if(getapp){

        const getuser = await Auth.findById(getapp.auth_id);
        if(getuser){
    const paymenIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: 100,
        automatic_payment_methods:{
            enabled: true
        },
        metadata: {
            email: getuser.email,
            item: getapp.application_type
         },
      })

      res.json({clientSecret:paymenIntent.client_secret})
        }else{
            res.json({error:"cant get the user"});
        }

      }else{
        res.json({error: "something bad happend"});
      }
       
    }catch(e){

        throw new Error(e);

    }

}

const paysuccess = async(req, res)=>{
    const {id} = req.body;
    try{

        const payapp = await Application.findByIdAndUpdate(id,{
            application_paid: true
           },{new:true});


            if(payapp){
            const finduserandupdate = await Auth.findById(payapp.auth_id);
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: finduserandupdate?.email,
                subject: 'Payment Successful at Diamond Hub',
                text:  "Your application payment has been successful. It will take 2 weeks to get a Certificate or License or Permit"
              };
              
              sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json({something: 'Email sent Unsuccessful'});
                }else{
                  res.json({message: 'Email sent Successful'});
                }
              })
            }else{

                res.json({something: 'Email sent Unsuccessful'})

            }

    }catch(e){
        throw new Error(e);
    }
}

const licensepayment = async(req, res)=>{

    const {auth_id, app_id} = req.body;

    try{
           const payapp = await Application.findByIdAndUpdate(app_id,{
            license_paid: true
           },{new:true});


            if(payapp){
            const finduserandupdate = await Auth.findById(auth_id);
            var mailOptions = {
                from: 'manwish01@gmail.com',
                to: finduserandupdate?.email,
                subject: 'Payment Successful at Diamond Hub',
                text:  "Your payment has been successful. Your certifcate or license was generated. Do business"
              };
              
              sendemail(mailOptions, function(error,info){
                if(error){
                  console.log(error);
                  res.json({something: 'something bad happend'});
                }else{
                  res.json({message: 'Payment Successful'});
                }
              })
            }else{
                res.json({something: 'something bad happend'})
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
                    messsage_type: 'New Application at Diamond Hub',
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
                          res.json({something: 'something bad happend'});
                        }else{
                          res.json(addcode);
                        }
                      })

                }else{
                res.json({something: 'something bad happend'})
            }

            }else{
                res.json({something: 'something bad happend'})
            }

    }catch(e){
        throw new Error(e);
    }

}

const updateApplication = async(req, res)=>{
    const {app_id, application_attachment} = req.body;
    try{

        const updateapp = Application.findByIdAndUpdate(app_id, {
            application_attachment: application_attachment,
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
const appAll = async(req, res)=>{
    const {application_type} = req.body;
    try{

        const allapps = await Application.find({application_type: application_type});

        res.json(allapps);

    }catch(e){
        throw new Error(e);
    }
}

const verifyreturn = async(req, res)=>{
    const {app_id, auth_id, thehead, themessage} = req.body;

    try{

        const createsms = await Comm.create({
            message_type: thehead,
            themessage: themessage
        });
        if(createsms){
            //send email and push to user
            const updateuser = await Auth.findByIdAndUpdate(auth_id, {
                $push:{
                    messages: createsms._id.toString()
                }
            },{new:true});
            const updateappsms = await Application.findByIdAndUpdate(app_id, {
                $push:{
                    application_comments: createsms._id.toString()
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
                  res.json({something: 'something bad happend'});
                }else{
                  res.json({message: 'Ok'});
                }
              })
        }else{
        res.json({something: 'something bad happend'})
    }

    }catch(e){
        throw new Error(e);
    }
}

const appverify = async(req, res)=>{
  
  const  {app_id, auth_id} = req.body;
  try{

    const verifypass = await Application.findByIdAndUpdate(app_id,{
        application_pending: false
    });
    //send sms to company for payment
    if(verifypass){
           
            const createsms = await Comm.create({
                message_type: "Application Payment",
                themessage: "Your application have passed the verification stage. Please pay application fees"
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
                    subject: "Application Payment",
                    text:  "Your application have passed the verification stage at Diamond Hub. Please pay application fees"
                  };
                  
                   sendemail(mailOptions, function(error,info){
                    if(error){
                      console.log(error);
                      res.json({something: 'something bad happend'});
                    }else{
                      res.json({message: 'Ready'});
                    }
                  })
            }else{
        res.json({something: 'something bad happend'})
    } 

       


    }else{
        res.json({something: 'something bad happend'})
    }
    

  }catch(e){
    throw new Error(e);
  }

}

const appapprove = async(req, res)=>{
  
  const  {app_id, auth_id, user_id} = req.body;
  try{

    const verifypass = await Application.findByIdAndUpdate(app_id,{
        application_approved: true,
        application_approveby: user_id
    });
    //send sms to company for payment
    if(verifypass){
           
            const createsms = await Comm.create({
                message_type: "Application Approved",
                themessage: "Your application Approved. Please pay to get your certifcate or license"
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
                    subject: "Application Approved",
                    text:  "Your application Approved at Diamond Hub. Please pay to get your certifcate or license"
                  };
                  
                   sendemail(mailOptions, function(error,info){
                    if(error){
                      console.log(error);
                      res.json({something: 'something bad happend'});
                    }else{
                      res.json({message: 'Ready'});
                    }
                  })
            }else{
        res.json({something: 'something bad happend'})
    } 

       


    }else{
        res.json({something: 'something bad happend'})
    }
    

  }catch(e){
    throw new Error(e);
  }

}
const officergetapp = async(req, res)=>{
     const {app_id} = req.body;
    try{

      const getapp = await Application.findById(app_id);
      if(getapp){

        const companyget = await Company.findOne({auth_id: getapp.auth_id}).populate('company_directors');

        res.json({
            applicationdetails: getapp,
            companydetails: companyget
        })

      }else{
        res.json({something: 'something bad happend'})
      }

    }catch(e){
        throw new Error(e);
    }
}

const applicationGet = async(req, res)=>{
    const {id} = req.params;
    try{

        const getone = await Application.findById(id);

        res.json(getone);

    }catch(e){
        throw new Error(e);
    }
}


module.exports ={paysuccess, getkey, applicationGet, verifyreturn, appverify, appapprove, officergetapp, appAll, uploadPhoto, getApplication, newApplication, viewcodes, updateApplication, applicationpayment, licensepayment};

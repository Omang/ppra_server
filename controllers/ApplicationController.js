const Company = require('../models/CompanyModel');
const Application = require('../models/ApplicationModel');
const Payment = require('../models/PaymentModel');
const Comm = require('../models/ComModel');
const {sendemail} = require('../config/MailConnect');
const Auth = require('../models/AuthModel');
const Subcodes = require('../models/SubcodesModel');

const normalpayment = async(req, res)=>{

    const {auth_id, app_id, company_id} = req.body;

    try{

        const paynormal = await Company.findByIdAndUpdate(company_id, {
            application_fees: true
        })
        

       
    }catch(e){

    }

}

const expresspayment = async(req, res)=>{

    const {company_id} = req.body;

    try{

        const paynormal = await Company.findByIdAndUpdate(company_id, {
            codes_express: true
        })
        

       
    }catch(e){

    }

}

const newApplication = async(req, res)=>{
    const {subcode, company_id, auth_id, attachment, subcode_level} = req.body;

    try{
        
        const addcode = await Application.create({
            auth_id: auth_id,
            company_id: company_id,
            subcode: subcode,
            attachment: attachment,
            subcode_level: subcode_level
        });

        if(addcode){
            const addtocompany = await Company.findByIdAndUpdate(company_id, {
                $push:{
                    company_codes: addcode._id.toString()
                }
            },{new:true});
            //send application made sms and contractor
            const getuser = await Auth.findById(auth_id);
            if(addtocompany && getuser){
              const sms = await Comm.create({
                    messsage_type: 'New Code Applied',
                    themessage: "New code applied. Waiting verification"
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
                        subject: 'New Code Applied',
                        text:  "New code applied success. Waiting verification"
                      };
                      
                      sendemail(mailOptions, function(error,info){
                        if(error){
                          console.log(error);
                          res.json(error);
                        }else{
                          res.json(addtocompany);
                        }
                      })

                }
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
    const {company_id} = req.body;
    const itemsend =[];
    
    try{

        const viewitems = await Company.findById(company_id).populate('company_codes');
        if(viewitems){
            for(let i =0; i < viewitems.company_codes.length; i++){
                 const { _id, subcode} = viewitems.company_codes[i];
                 const getcodename = await Subcodes.findById(subcode);
                 itemsend.push({ _id, getcodename});
            }
            res.json(itemsend);
        }

    }catch(e){
        throw new Error(e);
    }

}
const getApplication = async(req, res)=>{
    const {app_id} = req.body;
    try{
        const getApp = Application.findById(app_id).populate("Subcodes");

        res.json(getApp)

    }catch(e){
        throw new Error(e);
    }
}

module.exports ={newApplication, viewcodes, updateApplication, normalpayment, expresspayment};

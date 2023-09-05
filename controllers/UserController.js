const path = require('path');
const fs = require('fs');
const User = require('../models/UserModel');
const {google} = require('googleapis');
const Auth = require('../models/AuthModel');
const {generateRefreshToken} = require('../config/refreshToken');
const {generateToken} = require('../config/jwToken');
const {sendemail} = require('../config/MailConnect')

const CLIENT_ID ='373697671784-fn2hhqgarft9lb7v0rbdjleckfh0lgh0.apps.googleusercontent.com';
const CLIENT_SECRET ='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';
const REDIRECT_URL ='https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04lJnON2X0oQvCgYIARAAGAQSNwF-L9Ir8sTOq6a7R2o9OFss9lOmebxtM6RJiQ09FnNCGtaVnFryhZnrxf4lloW2kVE8kkecrsk';


const oauth2Client = new google.auth.OAuth2(
   CLIENT_ID,
   CLIENT_SECRET,
   REDIRECT_URL
  );
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
  version:'v3',
  auth: oauth2Client
})

const filePath = path.join(__dirname, 'invoice.jpg');

const uploadfile = async(req, res)=>{
  const {test} = req.body;
  try{

    const response = await drive.files.create({
      requestBody: {
        name: 'Companylicense.jpg',
        mimeTypes: 'image/jpg'
      },
      media: {
        mimeTypes: 'image/jpg',
        body: fs.createReadStream(filePath)
      }
    });
    console.log(response.data);
    res.json(response.data);

  }catch(e){
    console.log(e);
    throw new Error(e);
  }
}

const sendmail =async(req, res)=>{
    const {toemail, thesubject, themessage} = req.body;



var mailOptions = {
  from: 'manwish01@gmail.com',
  to: toemail,
  subject: thesubject,
  text: themessage
};

sendemail(mailOptions, function(error,info){
  if(error){
    console.log(error);
    res.json(error);
  }else{
    res.json({'mail sent' : info.response});
  }
})

}

const getUser =async(req, res)=>{
    const {id} = req.params;
    try{

        const userone = await Auth.findById(id);
        res.json(userone);

    }catch(e){
        throw new Error(e);
    }
}

const registeruser =async(req, res)=>{
    const {email, password, role} = req.body;
    try{
       const usercheck = await Auth.findOne({email: email});
       if(usercheck){
        res.json({message: 'User exists'});
       }else{
        const newUser = await Auth.create({email:email, password: password, role:role});
        //send email confirmation
        res.json({message: 'User created'});
       }

    }catch(e){
        throw new Error(e);
    }
    
}
const updateContractor =async(req, res)=>{
  const {
    auth_id,
    firstname,
    lastname,
    gender,
    mobilenumber,
    DOB,
    POB,
    nationality
    } = req.body;
    try{

      const contractorupdate = await Auth.findByIdAndUpdate(auth_id, {

        firstname: firstname,
        lastname: lastname,
        gender: gender,
        mobilenumber: mobilenumber,
        DOB: DOB,
        POB: POB,
        nationality: nationality

      },{
        new: true
      })

      res.json(contractorupdate);

    }catch(e){
      throw new Error(e);
    }

}
const addStuff = async(req, res)=>{
  const {
        password,
        email,
        firstname,
        lastname,
        gender,
        mobilenumber,
        DOB,
        POB,
        nationality
        } = req.body;
  try{
    const usercheck = await Auth.findOne({email: email});
       if(usercheck){
        res.json({message: 'User exists'});
       }else{
    const CreateUser = await Auth.create({
         password: password,
         email: email,
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        mobilenumber: mobilenumber,
        DOB: DOB,
        POB: POB,
        nationality: nationality
       
    });

    res.json(CreateUser);
  }

  }catch(e){
    throw new Error(e);
  }
}

const loginuser =async(req, res)=>{
    const {email, password} = req.body;
    console.log(req.body);
    
        try {
            const findone = await Auth.findOne({email:email});
            if(findone && await findone.isPasswordMatched(password))
        {
          const refreshtoken = await generateRefreshToken(findone?._id);
          const updateuser = await Auth.findByIdAndUpdate(
            findone._id,
            {
            refreshToken: refreshtoken
          },{
            new: true
          });
          res.json({
            _id: findone?._id,
            email: findone?.email,
            firstname: findone?.firstname,
            role: findone?.role,
            refreshToken: generateToken(findone?._id)
          });     
    
        }else{
            res.json({message:"Invalid Credentials"});
        }
        } catch (error) {
            throw new Error(error);
        }
}
const logout =async(req, res)=>{

    const {refreshToken} = req.body;
    //console.log(req.cookies);
    if(!refreshToken) throw new Error("No refresh Token in cookies");
    
    const user = await Auth.findOne({refreshToken: refreshToken}); 
    if(!user){
      
      return res.status(204) //forbidden
    }else{
      await Auth.findOneAndUpdate({_id:user._id.toString()}, {
      refreshToken: ""
    });
   
     res.json({logout: "logged out"}); //forbidden
    }  

}

module.exports = {uploadfile, registeruser, loginuser, logout, addStuff, getUser, sendmail, updateContractor};
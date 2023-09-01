const User = require('../models/UserModel');
const Auth = require('../models/AuthModel');
const {generateRefreshToken} = require('../config/refreshToken');
const {generateToken} = require('../config/jwToken');
const {sendemail} = require('../config/MailConnect')



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
            role: findone?.role,
            refreshToken: generateToken(findone?._id)
          });     
    
        }else{
            throw new Error("Invalid Credentials");
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

module.exports = {registeruser, loginuser, logout, addStuff, getUser, sendmail, updateContractor};
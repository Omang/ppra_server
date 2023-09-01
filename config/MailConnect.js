var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'manwish01@gmail.com',
      pass: 'pgybdgftbmvurkof'
    }
  });

const sendemail = async(mailOptions, callback)=>{

  await transporter.sendMail(mailOptions, function(error, info){
        callback(error, info);
      });
}

module.exports = { sendemail};
const nodemailer = require("nodemailer");
require("dotenv").config();

const otp = Math.floor(1000 + Math.random() * 9000);
function mailSend(emailID){
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'vsgproject56@gmail.com',
        pass: 'Sem5Project'
      }
    });
    var mailOptions = {
      from: 'vsgproject56@gmail.com',
      to: `${emailID}`,
      subject: 'Virtual Study Group PvtLtd',
      text: `OTP for account recovery:${otp}`
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports={mailSend,otp};
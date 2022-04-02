var nodemailer = require("nodemailer");
require("dotenv").config();

const otp = Math.floor(1000 + Math.random() * 9000);
function mailSend(emailID){
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'vsgproject56@gmail.com',
        pass: process.env.PASSWORD
      }
    });
    var mailOptions = {
      from: 'vsgproject56@gmail.com',
      to: `${emailID}`,
      subject: 'Virtual Study Group PvtLtd',
      text: `<h2>OTP for account recovery:</h2> <h1>${otp}</h1>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

module.exports={mailSend,otp};
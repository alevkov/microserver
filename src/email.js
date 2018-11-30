import { Router } from 'express';
const nodemailer = require('nodemailer');
const email = Router();

email.post('/send', (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'helios.event.gallery@gmail.com',
      pass: 'This1sabadpassword!'
    }
  });

  var mailOptions = {
    from: 'helios.event.station@gmail.com',
    to: req.body.emailRecepient,
    subject: 'Check out these photos!',
    text: req.body.emailBody
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 
});

export default email;
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
      res.status(500).json({error: error});
    } else {
      console.log('Email sent: ' + req.body.emailRecepient);
      res.status(200).json({"message": "Email Sent!"});
    }
  }); 
});

export default email;
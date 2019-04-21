import { Router } from 'express';
const nodemailer = require('nodemailer');
const email = Router();

email.post('/send', (req, res) => {
  console.log(req.body);
const mailjet = require ('node-mailjet')
    .connect('f3a535af49982f605366737c4de10e3c', '5988a995f24fca55d962a0c3d97d61c5')
const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages":[
                {
                        "From": {
                                "Email": "helios.event.gallery@gmail.com",
                                "Name": "Event Photos"
                        },
                        "To": [
                                {
                                        "Email": `${req.body.emailRecepient}`,
                                        "Name": ``
                                }
                        ],
                        "Subject": "Check out these photos!",
                        "TextPart": `${req.body.emailBody}`,
                        "HTMLPart": ""
                }
        ]
    })
request
    .then((result) => {
        res.status(200).json({success: result});
    })
    .catch((err) => {
        res.status(500).json({error: err});
    })

});

export default email;
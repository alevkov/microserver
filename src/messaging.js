import { Router } from 'express';

const messaging = Router();
const twilioNumber = '+12058831771';
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * GET example request
 */
messaging.post('/send', (req, res) => {
  console.log(req.body.smsBody);
  client.messages
   .create({
      body: req.body.smsBody,
      from: twilioNumber,
      to: req.body.smsRecepient
   })
   .then(message => {
      res.status(200).send({sid: message, status: "success"});
   })
   .catch(e => { 
      console.error('Got an error:', e.code, e.message); 
      res.status(500).send({error: e.message});
    })
   .done();
});

export default messaging;
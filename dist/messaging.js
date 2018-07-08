'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _express = require('express');

const messaging = (0, _express.Router)();
const sid = 'ACb1b80ea9efd602091eb0abe6c05ed979';
const authToken = '0aa3c6b463846d454d21de27ca74656c';
const twilioNumber = '+19549086944';
const client = require('twilio')(sid, authToken);

/**
 * GET example request
 */
messaging.post('/send', (req, res) => {
   console.log(req.body.smsBody);
   client.messages.create({
      body: req.body.smsBody,
      from: twilioNumber,
      to: req.body.smsRecepient
   }).then(message => {
      res.status(200).send({ sid: message, status: "success" });
   }).done();
});

exports.default = messaging;
//# sourceMappingURL=messaging.js.map
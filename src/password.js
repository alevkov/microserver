import { Router } from 'express';
const password = Router();
const storage = require('node-persist');

storage.init().then(() => {
  console.log('init storage');
});

password.post('/:eventId', async (req, res) => {
  console.log(req.body.pwd);
  await storage.setItem(req.params.eventId, req.body.pwd);
  res.status(200).send({ message: "success" });
});

password.post('/check/:eventId', async (req, res) => {
  let value = await storage.getItem(req.params.eventId);
  let keys = await storage.keys();
  if (`${value}` === `${req.body.pwd}`) {
    res.status(200).send({ message: "success" });
  } else {
    res.status(401).send({ message: "unauthorized" });
  }
});


export default password;
import { Router } from 'express';
const password = Router();

let eventCollection = null;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0-rdoqx.mongodb.net/test?retryWrites=true`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) {
    console.log(err);
  } else {
    eventCollection = client.db("helios").collection("event");
  }
});

password.post('/:eventId', (req, res) => {
  console.log(req.body.pwd);
  const record = { event: req.params.eventId, password: req.body.pwd };
  const query = { event: req.params.eventId };
  eventCollection.find(query).toArray(function(err, findRes) {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (findRes.length === 0) {
        eventCollection.insertOne(record, function(err, insertRes) {
          if (err) {
            res.status(500).send({ message: err });
          } else {
            res.status(200).send({ message: "success" });
          }
        });        
      } else {
        res.status(401).send({ message: "already exists" });
      }
    }
  });
});

password.post('/check/:eventId', (req, res) => {
  const query = { event: req.params.eventId };
  eventCollection.find(query).toArray(function(err, findRes) {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (findRes.length === 0) {
        res.status(401).send({ message: "unauthorized" });
      } else {
        const pwd = findRes[0].password;
        if (req.body.pwd === pwd) {
          res.status(200).send({ message: "success" });
        } else {
          res.status(401).send({ message: "unauthorized" });
        }          
      }
    }
  });
});


export default password;
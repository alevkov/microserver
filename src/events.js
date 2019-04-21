import { Router } from 'express';
import AWS from 'aws-sdk';
const events = Router();

AWS.config.update({
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": ""
});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const ddbc = new AWS.DynamoDB.DocumentClient();

/**
 * GET photos by id
 */
events.get('/:eventId', (req, res) => {
  const params = {
    ExpressionAttributeValues: {":eventId": req.params.eventId},
    FilterExpression: "EventID = :eventId",
    ProjectionExpression: "PhotoID",
    TableName: "helios-photo"
  };

  ddbc.scan(params, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send({ message: err });
    } else {
      res.status(200).send({ data: result });
    }
  });
});

/**
 * POST photo
 */
events.post('/:eventId', (req, res) => {
  const params = {
    TableName: "helios-photo",
    Item: {
      'PhotoID': {S: req.body.photoUrl},
      'EventID': {S: req.params.eventId}
    }
  }

  ddb.putItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.status(500).send({message: err});
    } else {
      console.log("Success", data);
      res.status(200).send({message: "OK Boss"});
    }
  });
});

/**
 * DELETE all photos by eventId
 */
events.get('/delete/:eventId', (req, res) => {
  const params = {
    ExpressionAttributeValues: {":eventId": req.params.eventId},
    FilterExpression: "EventID = :eventId",
    ProjectionExpression: "PhotoID",
    TableName: "helios-photo"
  };

  ddbc.scan(params, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send({ message: err });
    } else {
      var itemsToDelete = []
      for (var i = 0; i < result.Items.length; i++) {
        const item = {
          DeleteRequest: {
            Key: result.Items[i]
          }
        }
        itemsToDelete.push(item);
      }
      const delParams = {
        RequestItems: {
          "helios-photo": itemsToDelete
        }
      }
      console.log(delParams);
      ddbc.batchWrite(delParams, (deleteErr, deleteResult) =>{
        if (deleteErr) {
          res.status(500).send({ message: deleteErr });
        } else {
          res.status(200).send({ message: deleteResult });
        }
      });
    }
  });
});

export default events;
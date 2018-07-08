'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const events = (0, _express.Router)();

// update AWS region
_awsSdk2.default.config.loadFromPath('./secret/cred.json');
const ddb = new _awsSdk2.default.DynamoDB({ apiVersion: '2012-08-10' });
const ddbc = new _awsSdk2.default.DynamoDB.DocumentClient();

/**
 * GET photos by id
 */
events.get('/:eventId', (req, res) => {
  const params = {
    ExpressionAttributeValues: { ":eventId": req.params.eventId },
    FilterExpression: "EventID = :eventId",
    ProjectionExpression: "PhotoID",
    TableName: "helios-photo"
  };

  ddbc.scan(params, (err, result) => {
    if (err) {
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
    TableName: 'helios-photo',
    Item: {
      'PhotoID': { S: req.body.photoUrl },
      'EventID': { S: req.params.eventId }
    }
  };

  ddb.putItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.status(500).send({ message: err });
    } else {
      console.log("Success", data);
      res.status(200).send({ message: "OK Boss" });
    }
  });
});

/**
 * DELETE all photos by eventId
 */
events.delete('/:eventId', (req, res) => {
  const params = {
    ExpressionAttributeValues: { ":eventId": req.params.eventId },
    FilterExpression: "EventID = :eventId",
    ProjectionExpression: "PhotoID",
    TableName: "helios-photo"
  };

  ddbc.scan(params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
    } else {
      var itemsToDelete = [];
      for (var i = 0; i < result.Items.length; i++) {
        const item = {
          DeleteRequest: {
            Key: result.Items[i]
          }
        };
        itemsToDelete.push(item);
      }
      const delParams = {
        RequestItems: {
          'helios-photo': itemsToDelete
        }
      };
      ddbc.batchWrite(delParams, (deleteErr, deleteResult) => {
        if (deleteErr) {
          res.status(500).send({ message: deleteErr });
        } else {
          res.status(200).send({ message: deleteResult });
        }
      });
    }
  });
});

exports.default = events;
//# sourceMappingURL=events.js.map
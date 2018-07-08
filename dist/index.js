'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

const index = (0, _express.Router)();

/**
 * GET home page
 */
index.get('/', (req, res) => {
  res.send({ title: 'Express Babel' });
});

exports.default = index;
//# sourceMappingURL=index.js.map
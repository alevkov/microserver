import { Router } from 'express';

const index = Router();

/**
 * GET home page
 */
index.get('/', (req, res) => {
  res.send({ title: 'Express Babel' });
});

export default index;

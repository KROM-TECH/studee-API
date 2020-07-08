const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET request to /products'
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Handling POST request to /products'
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: 'Handling POST request to /products',
    id: id
  });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: 'Handling POST request to /products',
    id: id
  });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: 'Handling POST request to /products',
    id: id
  });
});


module.exports = router;
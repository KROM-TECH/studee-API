const express = require('express');
const { request } = require('../../app');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  //reject a file 
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  }, 
  fileFilter: fileFilter
})

const Question = require('../models/question.js');


router.get('/', (req, res, next) => {
  Question.find()
    .select('name price _id questionImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        questions: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            questionImage: doc.questionImage,
            _id: doc._id,
          }
        })
      };
      // if (docs.length >= 0) {
      res.status(200).json(response)
      // } else {
      //   res.status(404).json({ message: 'No entries found' })

      // }
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:questionId', (req, res, next) => {
  const id = req.params.questionId;
  Question.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

});

router.post('/', upload.single('questionImages'), (req, res, next) => {
  console.log(req.file)
  const question = new Question({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
    questionImage:req.file.path
  });
  question
    .save()
    .then((result) => {
      console.log(result)
      res.status(201).json({
        message: 'Question successfully sent',
        createdQuestion: {
          name: result.name,
          price: result.price,
          _id: result._id,
        }
      });
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err });
    });

});

router.patch('/:questionId', (req, res, next) => {
  const id = req.params.questionId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Question.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(err);
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  // Question.update({ _id: id }, { $set: { name: req.body.newName, price: req.body.newPrice } })
});

router.delete('/:questionId', (req, res, next) => {
  const id = req.params.questionId;
  Question.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json(result)
    }).catch(err => {
      console.log(err)
      res.save(500).json({ error: err })
    });
});


module.exports = router;
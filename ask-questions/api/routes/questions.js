const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const mongoose = require("mongoose");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



router.get("/", (req, res, next) => {
  Question.find()
    .select("name price _id questionImage")
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
            request: {
              type: "GET",
              url: "http://localhost:3000/questions/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single('questionImage'), (req, res, next) => {
  const question = new Question({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    questionImage: req.file.path
  });
  question
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created question successfully",
        createdquestion: {
          name: result.name,
          price: result.price,
          questionImage: result.questionImage,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/questions/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:questionId", (req, res, next) => {
  const id = req.params.questionId;
  question.findById(id)
    .select('name price _id questionImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          question: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/questions'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:questionId", (req, res, next) => {
  const id = req.params.questionId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  question.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'question updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/questions/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:questionId", (req, res, next) => {
  const id = req.params.questionId;
  question.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'question deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/questions',
          body: { name: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require('dotenv');
dotenv.config();


const questionRoutes = require('./api/routes/questions');


mongoose.connect(`mongodb+srv://studee:${process.env.MONGO_PASS}@cluster0.zfo6t.mongodb.net/Cluster0?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then().catch()

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads' ,express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
    return res.status(200).json({}); 
  }

  next()
})

//Routes which should handle request
app.use('/questions', questionRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;
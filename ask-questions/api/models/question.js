const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type:String, required:true},
  price: { type: Number, required: true },
  questionImage:{type:String, required:false}
});

module.exports = mongoose.model('Question', questionSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  age: {type: Number},
})

module.exports = mongoose.model('Parent', ParentSchema);
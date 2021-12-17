const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChildSchema = new Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  creditCards: [{type: Schema.Types.ObjectId, ref: 'CreditCard'}],
  parent: {type: Schema.Types.ObjectId, ref: 'Parent'},
},{
  timestamps: true,
})

module.exports = mongoose.model('Child', ChildSchema);
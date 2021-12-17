const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditCardSchema = new Schema({
  type: {type: String, enum: ["Silver", "Gold", "Platinum"]},
  number: {type: Number, max: 9999999999999999, min: 1000000000000000, unique: true, required: true},
  securityCode: {type: Number, max: 999, min: 111, required: true},
  expirationMonth: {type: Number, max: 12, min: 1, required: true},
  expirationYear: {type: Number, required: true},
  monthlyLimit: {type: Number, default: 0},
},{
  timestamps: true,
})

module.exports = mongoose.model('CreditCard', CreditCardSchema);
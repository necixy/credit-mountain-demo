require('dotenv').config();
console.log("*******************",process.env.NODE_ENV);
const mongoose = require('mongoose');
const connectionOptions = {};
const mongoUri = process.env.NODE_ENV == "development" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PROD;

try{
  mongoose.connect(mongoUri, connectionOptions);
} catch (err){
  console.log(err);
}

module.exports = {
  Parent: require('models/parent.model'),
  Child: require('models/child.model'),
  Card: require('models/card.model')
};
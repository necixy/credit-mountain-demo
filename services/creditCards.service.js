const db = require('utils/db');

module.exports = {
  createCard,
  updateCardLimit,
  deleteCard,
  getCards,
  chargeCard
}

async function createCard(parent, type){
  let card = new db.Card({
    number: Math.floor(Math.random() * (Math.pow(10, 16)) - (Math.pow(10, 15) + 1)) + Math.pow(10, 15) + 1,
    securityCode: Math.floor(Math.random() * (999 - 100)) + 100,
    createdBy: parent._id,
    type,
    expirationMonth: new Date().getMonth(),
    expirationYear: new Date().getFullYear() + 6,
  })

  card = await card.save();

  return card;
}

async function updateCardLimit(parent, cardId, monthlyLimit){
  let card = await db.Card.findOne({_id: cardId, createdBy: parent._id}).exec();

  card.monthlyLimit = monthlyLimit;
  card = await card.save({new: true});

  return {card};
}

async function deleteCard(parent, cardId){
  const deleted = await db.Card.deleteOne({_id: cardId, createdBy: parent._id}).exec();

  db.Child.updateOne({parent: parent._id, creditCards: cardId}, {$pull: {creditCards: cardId}}).exec();

  if(deleted.deletedCount === 0){
    throw 'Card didn\'t get deleted!'
  }

  return true;
}

async function getCards(parent){
  const cards = await db.Card.find({createdBy: parent._id}).exec();
  if(cards.length === 0){
    throw 'No cards available!'
  }

  return {cards};
}

async function chargeCard(parent, body) {
  const {number, securityCode, expirationMonth, expirationYear} = body;
  let card = await db.Card.findOne({parent: parent._id, number, securityCode, expirationMonth, expirationYear }).exec();

  if(!card){
    throw 'Invalid card details!';
  }

  if(card.monthlyLimit > body.charge){
    card.monthlyLimit -= body.charge;
  }
  else{
    throw `Your charges are exceeding monthly limit. Your remaining monthly limit is: ${card.monthlyLimit}.`
  }

  card = await card.save({new: true});

  return card;
}
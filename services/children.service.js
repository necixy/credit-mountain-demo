const db = require('utils/db');
const cardsService = require('services/creditCards.service');

module.exports = {
  createChild,
  updateChild,
  deleteChild,
  getChildren,
  getChildACreditCard
}

async function createChild(parent, body){
  let child = new db.Child(body);
  child.parent = parent._id;
  child = await child.save();

  return child;
}

async function updateChild(parent, body, childId) {
  let child = await db.Child.findOne({_id: childId, parent: parent._id}).exec();

  if(!child){
    throw 'This child doesn\'t exist!';
  }

  child._doc = {...child._doc, ...body};

  child = await child.save();
  return {child};
}

async function deleteChild(parent, childId){
  const deleted = await db.Child.deleteOne({_id: childId, parent: parent._id }).exec();
  if(deleted.deletedCount != 1){
    throw 'Child couldn\'t be deleted.';
  }

  return true;
}

async function getChildren(parent){
  const children = await db.Child.find({parent: parent._id}).populate('creditCards').exec();
  if(children.length === 0){
    throw 'No children found!';
  }

  return children;
}

async function getChildACreditCard(parent, childId, type) {
  if(!["Silver", "Gold", "Platinum"].includes(type)){
    throw 'Please, provide with a valid card type.';
  }
  let child = await db.Child.findOne({parent: parent._id, _id: childId}).exec();

  if(!child) {
    throw 'No such child exists!';
  }

  const card = await cardsService.createCard(parent, type);

  if(child.creditCards){
    child.creditCards.push(card._id);
  }
  else{
    child.creditCards = [card._id];
  }

  child = await child.save({new: true})
  return {child, card};
}

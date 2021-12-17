const express = require('express');
const router = express.Router();
const authorize = require('utils/authorize');
const cardsService = require('services/creditCards.service');
const Joi = require('joi');
const validateRequest = require('../utils/validateRequest');

router.patch('/limit/:cardId', authorize(), updateCardLimit);
router.delete('/:cardId', authorize(), deleteCard);
router.get('', authorize(), getCards);
router.patch('/charge', authorize(), chargeCardSchema, chargeCard)

module.exports = router;

async function updateCardLimit(req, res, next){
  cardsService.updateCardLimit(req.user, req.params.cardId, req.body.monthlyLimit)
    .then((data) => res.json({message: 'Credit-Card Limit has been updated!', success: true, data}))
    .catch(next)
}

async function deleteCard(req, res, next) {
  cardsService.deleteCard(req.user, req.params.cardId)
    .then(() => res.json({message: 'Card has been deleted successfully.', success: true, data: {}}))
    .catch(next)
}

async function getCards(req, res, next) {
  cardsService.getCards(req.user)
    .then((data) => res.json({message: '', success: true, data}))
    .catch(next)
}

function chargeCardSchema(req, res, next) {
  const schema = Joi.object({
    number: Joi.number().required(),
    securityCode: Joi.number().required(),
    expirationMonth: Joi.number().required(),
    expirationYear: Joi.number().required(),
    charge: Joi.number().required(),
  })

  validateRequest(req, next, schema);
}

async function chargeCard(req, res, next) {
  cardsService.chargeCard(req.user, req.body)
    .then((data) => res.json({message: '', success: true, data}))
    .catch(next)
}
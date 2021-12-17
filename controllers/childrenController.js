const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('utils/validateRequest');
const authorize = require('utils/authorize');
const childrenService = require('services/children.service');

router.post('', authorize(), createChildSchema, createChild);
router.patch('/:childId', authorize(), updateChildSchema, updateChild);
router.delete('/:childId', authorize(), deleteChild);
router.get('', authorize(), getChildren);
router.patch('/card/:childId/:type', authorize(), getChildACreditCard);

module.exports = router;

function createChildSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number(),
  })

  validateRequest(req, next, schema);
}

function createChild(req, res, next) {
  childrenService.createChild(req.user, req.body)
    .then((data) => res.json({message: 'Child created successfully.', success: true, data}))
    .catch(next)
}

function updateChildSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string(),
    age: Joi.number(),
  })

  validateRequest(req, next, schema);
}

function updateChild(req, res, next) {
  childrenService.updateChild(req.user, req.body,  req.params.childId)
    .then((data) => res.json({message: 'Child information has been updated successfully.', success: true, data}))
    .catch(next)
}

function deleteChild(req, res, next) {
  childrenService.deleteChild(req.user, req.params.childId)
    .then((data) => res.json({message: 'Child information has been deleted successfully.', success: true, data: {}}))
    .catch(next)
}

function getChildren(req, res, next) {
  childrenService.getChildren(req.user)
    .then((data) => res.json({message: '', success: true, data}))
    .catch(next)
}

function getChildACreditCard(req, res, next) {
  childrenService.getChildACreditCard(req.user, req.params.childId, req.params.type)
    .then((data) => res.json({message: '', success: true, data}))
    .catch(next)
}
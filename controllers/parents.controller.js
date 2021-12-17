const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("utils/validateRequest");
const authorize = require("utils/authorize");
const parentsService = require("services/parents.service");

router.post("/signup", signupSchema, signup);
router.post("/login", loginSchema, login);
router.patch(
  "/change-password",
  authorize(),
  changePasswordSchema,
  changePassword
);
router.patch("/update-profile", authorize(), updateProfileSchema, updateProfile);

module.exports = router;

function signupSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string().min(8).required(),
    age: Joi.number(),
  });

  validateRequest(req, next, schema);
}

function signup(req, res, next) {
  parentsService
    .signup(req.body)
    .then((data) =>
      res.json({ message: "Signed up successfully.", success: true, data })
    )
    .catch(next);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  validateRequest(req, next, schema);
}

function login(req, res, next) {
  parentsService
    .login(req.body)
    .then((data) =>
      res.json({
        message: "You have successfully logged-in.",
        success: true,
        data: data,
      })
    )
    .catch(next);
}

function changePasswordSchema(req, res, next) {
  const schema = Joi.object({
    currentPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
  });

  validateRequest(req, next, schema);
}

function changePassword(req, res, next) {
  parentsService
    .changePassword(req.user, req.body.currentPassword, req.body.newPassword)
    .then((data) =>
      res.json({
        message: "Password changed successfully.",
        success: true,
        data: data,
      })
    )
    .catch(next);
}

function updateProfileSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    age: Joi.number(),
  });

  validateRequest(req, next, schema);
}

function updateProfile(req, res, next) {
  parentsService
    .updateProfile(req.user, req.body)
    .then((data) =>
      res.json({
        message: "Profile updated successfully.",
        success: true,
        data,
      })
    )
    .catch(next);
}

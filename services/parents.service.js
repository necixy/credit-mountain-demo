require("dotenv");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("utils/db");
const jwt = require("jsonwebtoken");

module.exports = {
  signup,
  login,
  changePassword,
  updateProfile,
};

function createHash(password) {
  return bcrypt.hashSync(password, 10);
}

function generateJwtToken(user) {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: `10080m`,
  });
}

function basicDetails(user) {
  return { ...user, password: undefined };
}

async function signup(params) {
  if (params.password != params.passwordConfirm) {
    throw "Password doesn't match up!";
  }
  if (await db.Parent.findOne({ email: params.email })) {
    throw "This email already exists! Please, login.";
  }

  let parent = new db.Parent(params);

  parent.password = createHash(params.password);

  parent = (await parent.save())._doc;
  const jwtToken = generateJwtToken(parent);

  return { user: basicDetails(parent), accessToken: jwtToken };
}

async function login(body) {
  const parent = await db.Parent.findOne({ email: body.email }).exec();

  if (!parent || !bcrypt.compareSync(body.password, parent.password)) {
    throw "Either email or password is incorrect!";
  }

  const jwtToken = generateJwtToken(parent);

  return { accessToken: jwtToken };
}

async function changePassword(user, currPassword, newPassword) {
  if (!bcrypt.compareSync(currPassword, user.password)) {
    throw "Current password is incorrect!";
  }

  user.password = createHash(newPassword);
  await user.save();
  const jwtToken = generateJwtToken(user);

  return { accessToken: jwtToken };
}

async function updateProfile(user, body) {
  user.name = body.name || user.name;
  user.email = body.email || user.email;
  user.age = body.age || user.age;

  user = await user.save({ new: true });
  return { user };
}

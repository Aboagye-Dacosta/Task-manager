const passport = require("passport");
const crypto = require("crypto");
const { getUserByEmail, saveUser } = require("../model/users.model");
const createdRequired = require("../services/createRequiredFields.services");

async function httpSaveUser(req, res, next) {
  console.log(req.body);

  for (let [key, value] of Object.entries(req.body)) {
    if (!value) {
      console.error(`${key} parameter is empty`);
      return res.redirect("/auth/register");
    }
  }

  const {
    userIdentifier,
    username: email,
    password,
    confirmPassword,
  } = req.body;

  const results = await getUserByEmail(email);
  if (results) {
    return res.redirect("/auth/register");
  }

  if (password !== confirmPassword) {
    return res.redirect("/auth/register");
  }

  const { id, createdAt, updatedAt } = createdRequired();
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");

  saveUser([id, userIdentifier, email, key, salt, createdAt, updatedAt], next);
}

//reading user
async function httpReadUser(email, password, callback) {
  if (!email) return callback("email cannot be empty");
  if (!password) return callback("password cannot be empty");

  const user = await getUserByEmail(email);
  if (!user) return callback("the user does not exist");

  const key = crypto.pbkdf2Sync(password, user.user_salt, 100000, 64, "sha512");

  if (!crypto.timingSafeEqual(user.user_hash_password, key)) {
    console.log("password does not match");
    return callback("password incorrect");
  }

  //  user_id INTEGER NOT NULL UNIQUE,
  //       user_name Text not null,
  //       user_email TEXT NOT NULL UNIQUE,
  console.log(user);

  callback(null, {
    id: user.user_id,
    username: user.user_name,
    email: user.user_email,
  });
}

module.exports = {
  httpSaveUser,
  httpReadUser,
  createdRequired,
};

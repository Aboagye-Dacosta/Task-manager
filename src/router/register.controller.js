const passport = require("passport");
const crypto = require("crypto");
const {
  getUserByEmail,
  saveUser,
  updateUser,
  getUserByUserId,
} = require("../model/users.model");
const createdRequired = require("../services/createRequiredFields.services");

function setSessionBody(user) {
  return {
    id: user.user_id,
    username: user.user_name,
    email: user.user_email,
    noProfile: user.user_profile_image ? false : true,
    hasProfile: user.user_profile_image ? true : false,
    profile: user.user_profile_image,
  };
}

//TODO save user to db
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

//TODO reading user
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
  callback(null, setSessionBody(user));
}

//TODO update user details
async function httpUpdateUser(req, res, next, fields, file) {
  console.log(fields, file);
  if (Object.keys(file).length === 0) {
    file = null;
  } else {
    file = file.photo.newFilename;
  }
  const { updatedAt } = createdRequired();
  try {
    await updateUser(
      req.user,
      {
        username: fields.userIdentifier,
        email: fields.username,
      },
      file,
      updatedAt
    );
  } catch (error) {
    next(err);
  }
  const user = await getUserByUserId(req.user.id);
  req.session.passport.user = setSessionBody(user);
  req.session.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  return next();
}

module.exports = {
  httpSaveUser,
  httpReadUser,
  httpUpdateUser,
};

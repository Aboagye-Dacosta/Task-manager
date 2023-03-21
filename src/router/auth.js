const express = require("express");
const path = require("path");
const passport = require("passport");
const formidable = require("formidable");
const {
  httpSaveUser,
  httpReadUser,
  httpUpdateUser,
} = require("./register.controller");
const LocalStrategy = require("passport-local");


const authRouter = express.Router();

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    console.log(username, password);
    httpReadUser(username, password, done);
  })
);

authRouter.post(
  "/user/update",
  (req, res, next) => {
    const form = formidable({
      multiples: true,
      uploadDir: path.join(__dirname, "..", "..", "public", "uploads"),
      keepExtensions: true,
      filename: (name, ext, part, form) => {
        return `${req.user.id}#${Date.now()}${ext}`;
      },

      filter: ({ name, originalFilename, mimetype }) => {
        return mimetype === "image/jpeg" || mimetype === "image/png";
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      httpUpdateUser(req, res, next, fields, files);
    });
  },
  (req, res) => {
  
    res.redirect("/tasks/profile");
  }
);

authRouter.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/tasks");
  }
  return res.render("login", {
    title: "Login",
    layout: "/layouts/register",
  });
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    successRedirect: "/tasks",
  })
);

//register with google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/tasks",
    failureRedirect: "/auth/login",
  })
);

//register user
authRouter.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/tasks");
  }
  return res.render("register", {
    title: "Register",
    layout: "/layouts/register",
  });
});

authRouter.post(
  "/register",
  httpSaveUser,
  passport.authenticate("local", {
    failureRedirect: "/auth/register",
    successRedirect: "/tasks",
  })
);

//logout user from session
authRouter.get(
  "/logout",
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/auth/login");
    });
  },
  (req, res) => {
    res.send("sorry something happened");
  }
);

module.exports = authRouter;

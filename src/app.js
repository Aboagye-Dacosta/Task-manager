const path = require("path");

const hbs = require("hbs");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const authRouter = require("./router/auth");
const taskRouter = require("./router/tasks/tasks.router");

const app = express();

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", hbs.__express);
hbs.registerPartials(path.join(__dirname, "views", "partials"));

//middleware
app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
      db: "session.db",
      dir: path.join(__dirname, "data"),
    }),
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));
app.use(helmet());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.authenticate("session"));

//serving static files
app.use(express.static(path.join(__dirname, "..", "public")));

//router
app.use("/auth", nocache, authRouter);
app.use("/tasks", nocache, taskRouter);

app.get("/", nocache, (req, res) => {
  if (req.user) {
    return res.redirect("/tasks");
  }
  res.render("splash", {
    layout: "/layouts/splash",
  });
});

module.exports = app;

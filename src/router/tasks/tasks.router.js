const express = require("express");
const path = require("path");
const createWorker = require("../../services/worker.main.services");
const {
  httpSaveTask,
  httpReadTasks,
  httpDeleteTaskById,
  httpUpdateTask,
} = require("./tasks.controller");

const taskRouter = express.Router();

function renderView(req, res) {
  const type = req.params.type;
  res.render("home", {
    layout: "/layouts/main",
    tasks: req.tasks,
    user: req.user,
    count: res.app.locals.count,
    title: type
      ? `${type
          .replaceAll("-", " ")
          .replace(type[0], type[0].toUpperCase())} tasks`
      : "My Day",
    showInput: true,
    show: res.app.locals.count?.completed > 0 ? true : false,
    path: type ? `/tasks/${type}` : `/tasks`,
  });
}

function filterData(filter) {
  return async (req, res, next) => {
    const filters = {
      current: "filterCurrent",
      param: req.params.type
        ? `filter${req.params.type.replace(
            req.params.type[0],
            req.params.type[0].toUpperCase()
          )}`
        : "",
    };

    const results = await createWorker(
      path.join(__dirname, "..", "..", "services", "worker.services.js"),
      { data: req.tasks, action: filters[filter] }
    );

    req.tasks = results.data;
    res.app.locals.count = results.count;

    next();
  };
}

taskRouter.get("/", httpReadTasks, filterData("current"), renderView);

taskRouter.post("/", httpSaveTask);

taskRouter.get("/profile", (req, res) => {
  res.render("profile", {
    layout: "/layouts/main",
    showInput: false,
    user: req.user,
    title: "Your Profile",
    count: res.app.locals.count,
    totalCompleted: res.app.locals.count,
  });
});

taskRouter.get(
  "/:type",
  (req, res, next) => {
    const types = ["planned", "important", "current", "all", "assigned-to-me"];
    let type = req.params.type;
    console.log(type);
    if (types.includes(type)) {
      return next();
    } else {
      return res.render("pageNotFound");
    }
  },
  httpReadTasks,
  filterData("param"),
  renderView
);

taskRouter.post("/:type", httpSaveTask);

taskRouter.put("/:id", httpUpdateTask, (req, res) => {
  res.redirect("/");
});

taskRouter.get("/i")

taskRouter.delete("/:id", httpDeleteTaskById);

module.exports = taskRouter;

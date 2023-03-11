const { response } = require("express");
const express = require("express");
const path = require("path");
const createWorker = require("../../services/worker.main.services");
const {
  httpSaveTask,
  httpReadTasks,
  httpDeleteTaskById,
  httpUpdateTaskCompleted,
  httpUpdateTaskImportant,
} = require("./tasks.controller");

const taskRouter = express.Router();

function renderView(req, res) {
  res.render("home", {
    layout: "/layouts/main",
    tasks: req.tasks,
    user: req.user,
    showInput: true,
    path: req.params.type ? `/tasks/${req.params.type}` : `/tasks`,
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

    console.log(filter);
    const data = await createWorker(
      path.join(__dirname, "..", "..", "services", "worker.services.js"),
      { data: req.tasks, action: filters[filter] }
    );

    req.tasks = data;
    next();
  };
}

taskRouter.get("/", httpReadTasks, filterData("current"), renderView);

taskRouter.get("/profile", (req, res) => {
  res.render("profile", {
    layout: "/layouts/main",
    showInput: false,
    user: req.user,
  });
});

taskRouter.get("/:type", httpReadTasks, filterData("param"), renderView);

taskRouter.post("/", httpSaveTask);

taskRouter.post("/:type", httpSaveTask);

taskRouter.put("/important", httpUpdateTaskImportant);

taskRouter.put("/completed", httpUpdateTaskCompleted);

taskRouter.delete("/:id", httpDeleteTaskById);

module.exports = taskRouter;

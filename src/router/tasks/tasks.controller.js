const path = require("path");
const createdRequired = require("../../services/createRequiredFields.services");
const createWorker = require("../../services/worker.main.services");

const {
  saveTask,
  updateTask,
  deleteTaskById,
  readTask,
} = require("../../model/tasks.model");

const { updateUser, getUserByEmail } = require("../../model/users.model");

const validParams = ["basic", "planned", "important", "assigned-to-me"];

//update updateFields
function updateFields(tasks) {
  if (!tasks) return [];
  return tasks.map((task) => {
    return {
      ...task,
      done: task.task_completed === 1 ? true : false,
      notDone: task.task_completed === 0 ? true : false,
      important: task.task_important === 1 ? true : false,
      notImportant: task.task_important === 0 ? true : false,
      checked: task.task_completed === 1 ? "checked" : "",
      checkedImportant: task.task_important === 1 ? "checked" : "",
    };
  });
}

//save
function httpSaveTask(req, res, next) {
  let { type } = req.params;

  if (!type || type == "all") type = "basic";

  if (!validParams.includes(type)) return res.redirect(`/tasks/${type}`);

  const { task_content } = req.body;
  const { id: user_id } = req.user;

  if (!task_content)
    return res.redirect(
      req.params.type ? "/tasks/" + req.params.type : "/tasks"
    );

  const { id, createdAt, updatedAt } = createdRequired();
  const task = {
    taskId: id,
    taskType: type,
    taskContent: task_content,
    important: type === "important" ? 1 : 0,
    completed: 0,
    createdAt,
    updatedAt,
  };

  saveTask(task, user_id, next);
  res.redirect(req.params.type ? "/tasks/" + req.params.type : "/tasks");
}

//read tasks
async function httpReadTasks(req, res, next) {
  const { id: user_id } = req.user;

  try {
    const rows = await readTask(user_id);
    req.tasks = updateFields(rows);
    next();
  } catch (error) {
    next(error);
  }
}

//updated
async function httpUpdateTask(req, res, next) {
  const { completed, important, id } = req.body;

  console.log(req.body);

  if (!id) next();
  try {
    await updateTask(id, completed, important);
  } catch (err) {
    next(err);
  }

  next();
}

//delete
function httpDeleteTaskById(req, res) {}

//TODO update user profile - move it to auth

module.exports = {
  httpSaveTask,
  httpReadTasks,
  httpDeleteTaskById,
  httpUpdateTask,
};

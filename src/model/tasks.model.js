const db = require("../services/connect.db.services");

//save task
function saveTask(task, userId, next) {
  db.serialize(() => {
    db.run(
      "INSERT INTO tasks (task_id, task_type, task_description, task_important, task_completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        task.taskId,
        task.taskType,
        task.taskContent,
        task.important,
        task.completed,
        task.createdAt,
        task.updatedAt,
      ],
      (err) => {
        if (err) return next(err);
      }
    );

    db.run(
      "INSERT INTO user_tasks (user_id, task_id, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [userId, task.taskId, task.createdAt, task.updatedAt],
      (err) => {
        if (err) return next(err);
      }
    );
  });
}

//read tasks by user id and task name
function readTask(userId) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.all(
        "SELECT * FROM tasks INNER JOIN user_tasks ON tasks.task_id = user_tasks.task_id WHERE user_tasks.user_id = ?",
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
      // } else {
      //   db.all(
      //     "SELECT * FROM tasks INNER JOIN user_tasks ON tasks.task_id = user_tasks.task_id WHERE user_tasks.user_id = ? AND tasks.task_type = ?",
      //     [userId, type],
      //     (err, rows) => {
      //       if (err) return reject(err);
      //       resolve(rows);
      //     }
      //   );
      // }
    });
  });
}
//update task by user id and type of update
function updateTask(id, completed, important) {
  console.log(id, completed, important);
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      if (completed >= 0) {
        db.run(
          "UPDATE tasks SET task_completed = ? WHERE task_id = ?",
          [completed, id],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      }

      if (important >= 0) {
        db.run(
          "UPDATE tasks SET task_important = ? WHERE task_id = ?",
          [important, id],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      }
    });
  });
}

//delete task
function deleteTaskById() {}

module.exports = {
  saveTask,
  readTask,
  updateTask,
  deleteTaskById,
};

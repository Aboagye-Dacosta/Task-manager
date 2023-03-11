"use strict";

const taskInput = document.querySelector("#task__input");
const sendTask = document.querySelector("#postTask");

taskInput.addEventListener("focus", (e) => {
  const parent = e.target.closest(".task__input");
  parent.children[0].src = "./../img/svgs/add.svg";
});

taskInput.addEventListener("blur", (e) => {
  const parent = e.target.closest(".task__input");
  parent.children[0].src = "./../img/svgs/circle.svg";
});

// sendTask.addEventListener("click", function (e) {
//   const task = taskInput.value;
//   if (!task) return;

//   fetch(`https://localhost:8000/tasks`, {
//     method: "Post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       content: task,
//     }),
//   });
// });

"use strict";

const taskInput = document.querySelector("#task__input");
const sendTask = document.querySelector("#postTask");
const checkbox = document.querySelector("#taskCompleted");
const checkBoxParent = document.querySelector(".home-my-day__content");

taskInput.addEventListener("focus", (e) => {
  const parent = e.target.closest(".task__input");
  parent.children[0].src = "./../img/svgs/add.svg";
});

taskInput.addEventListener("blur", (e) => {
  const parent = e.target.closest(".task__input");
  parent.children[0].src = "./../img/svgs/circle.svg";
});

checkBoxParent.addEventListener("click", (e) => {
  const classList = e.target.classList;

  if (classList.contains("task__item__check-completed__checkbox")) {
    const id = e.target.dataset.itemid;
    let state = 0;

    console.log(e.target);

    if (e.target.checked == true) {
      state = 1;
    }

    updateCompletedOrImportant(id, state, -1);

    window.location.reload();
  }

  if (classList.contains("task__item__check-important__checkbox")) {
    const id = e.target.dataset.itemid;
    let state = 0;

    console.log(e.target);

    if (e.target.checked == true) {
      state = 1;
    }

    updateCompletedOrImportant(id, -1, state);

    window.location.reload();
  }
});

function updateCompletedOrImportant(id, completed, important) {
  fetch(`https://localhost:8000/tasks/${id}`, {
    method: "Put",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      completed: completed,
      important: important,
    }),
  });
}


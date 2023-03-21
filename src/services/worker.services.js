const { workerData, parentPort } = require("worker_threads");

const { data, action } = workerData;

// function doHalf(data) {
//   return new Promise((resolve, reject) => {
//     const results = [...data].filter((item) => {
//       new Date(item.created_at).toLocaleDateString() ===
//         new Date().toDateString();
//     });
//     resolve(results);
//   });
// }

// async function getDataCreatedToday(data) {
//   if (!data) return parentPort.postMessage([]);
//   if (data.length === 0) return parentPort.postMessage([]);
//   const half = parseInt(data.length / 2);
//   const results = await Promise.all([
//     doHalf([...data].slice(0, half)),
//     doHalf([...data].slice(half, data.length)),
//   ]);

// parentPort.postMessage(results.flat());
// }

// getDataCreatedToday(data);

let countCompleted = 0;

if (!data) return parentPort.postMessage([]);
if (data.length === 0) return parentPort.postMessage([]);

function filterCurrent() {
  const results = [...data].filter((item) => {
    return (
      new Date(item.created_at).toLocaleDateString() ===
        new Date().toLocaleDateString() && item.task_type !== "important"
    );
  });

  return results;
}

function filterImportant() {
  const result1 = data.filter((item) => item.task_type === "important");
  const result2 = data.filter(
    (item) => item.task_important === 1 && item.task_type !== "important"
  );
  const results = [result1, result2].flat(1);

  return results;
}

function filterPlanned() {
  const results = data.filter((item) => item.task_type === "planned");
  return results;
}

function filterAssignedToMe() {
  const results = data.filter((item) => item.task_type === "assigned-to-me");
  return results;
}

function countComplete(data) {
  return data.reduce((acc, item) => {
    if (item.task_completed === 1) acc++;
    return acc;
  }, 0);
}

countListByType = {
  planned: filterPlanned().length,
  important: filterImportant().length,
  current: filterCurrent().length,
  assignedToMe: filterAssignedToMe().length,
  all: data.length,
  completed: countCompleted,
  totalCompleted: countComplete(data),
  pending: data.length - countComplete(data),
};

// updateFields
let results = [];

if (action === "filterCurrent") {
  results = filterCurrent();
  countListByType.completed = countComplete(results);
}
if (action === "filterImportant") {
  results = filterImportant();
  countListByType.completed = countComplete(results);
}
if (action === "filterPlanned") {
  results = filterPlanned();
  countListByType.completed = countComplete(results);
}
if (action === "filterAll") {
  results = data;
  countListByType.completed = countComplete(results);
}

if (action === "filterAssigned-to-me") {
  results = filterAssignedToMe();
  countListByType.completed = countComplete(results);
}

parentPort.postMessage({
  data: results,
  count: countListByType,
});
// if (action === "updateFields") updateFields();

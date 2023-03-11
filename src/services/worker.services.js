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

if (!data) return parentPort.postMessage([]);
if (data.length === 0) return parentPort.postMessage([]);

function filterCurrent() {
  const results = [...data].filter((item) => {
    return (
      new Date(item.created_at).toLocaleDateString() ===
        new Date().toLocaleDateString() && item.task_type !== "important"
    );
  });

  parentPort.postMessage(results);
}

function filterImportant() {
  const result1 = data.filter((item) => item.task_type === "important");
  const result2 = data.filter(
    (item) => item.task_important === 1 && item.task_type !== "important"
  );
  parentPort.postMessage([result1, result2].flat(1));
}

function filterPlanned() {
  const results = data.filter((item) => item.task_type === "planned");
  parentPort.postMessage(results);
}

// updateFields

if (action === "filterCurrent") filterCurrent();
if (action === "filterImportant") filterImportant();
if (action === "filterPlanned") filterPlanned();
if (action === "filterAll") parentPort.postMessage(data);

// if (action === "updateFields") updateFields();

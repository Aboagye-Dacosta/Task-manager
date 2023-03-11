const { Worker, workerData } = require("worker_threads");

function createWorker(path, data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path, { workerData: data });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

module.exports = createWorker;

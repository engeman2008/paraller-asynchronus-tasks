import express from "express";
import PQueue from "p-queue";

import { runTask, hasTask } from "./TaskRunner.js";
// https://www.npmjs.com/package/p-queue
const app = express();
app.use(express.json());

app.post("/api/runTasks", async (req, res, next) => {
  const tasks = req.body.taskIds;
  const execOrder = [];
  const output = [];
  const queue = new PQueue({ concurrency: tasks.length });
  tasks.forEach(async (taskId) => {
    if (!hasTask(taskId)) {
      return res.status(400).send();
    }
    await queue.add(async () => runTask(taskId));
    execOrder.push(taskId);
    // console.log(taskId + ". Resolved");
  });
  await queue.onIdle();
  console.log("execOrder " + execOrder);
  execOrder.forEach((executedTask, index) => {
    const executedTasksBefore = execOrder.slice(0, index);
    const orginalTaskIndex = tasks.findIndex((task) => task === executedTask);
    const allOriginalTasksBefore = tasks.slice(0, orginalTaskIndex);

    if (allOriginalTasksBefore.length === 0) {
      output[orginalTaskIndex] = orginalTaskIndex;
    } else {
      let checker = allOriginalTasksBefore.every((v) =>
        executedTasksBefore.includes(v)
      );
      output[orginalTaskIndex] = checker ? orginalTaskIndex : -1;
    }
  });
  console.log(output);
  res.status(201).send();
});

app.listen(3000, () => {
  console.log("started");
});

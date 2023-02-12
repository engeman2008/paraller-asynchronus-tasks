const taskIds = ["id0", "id1", "id2", "id3", "id4", "id5"];
export const runTask = (id) => {
  return new Promise((resolve, reject) => {
    const min = 0,
      max = 5;
    const rand = Math.floor(Math.random() * (max - min + 1) + min);
    setTimeout(() => {
      resolve();
    }, rand * 1000);
  });
};
export const hasTask = (id) => {
  return taskIds.includes(id);
};

import ShortUniqueId from "short-unique-id";

const taskID = new ShortUniqueId({
  length: 5,
});

export const getRandomIdForTask = () => {
  return taskID.randomUUID();
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@agendapersonalapp_tasks';

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const getTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    throw error;
  }
};

export const addTask = async (task) => {
  const tasks = await getTasks();
  const newTask = {
    ...task,
    id: task.id ?? generateId(),
  };

  const updatedTasks = [...tasks, newTask];
  await saveTasks(updatedTasks);
  return newTask;
};

export const updateTask = async (id, updatedData) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, ...updatedData, id } : task
  );

  await saveTasks(updatedTasks);
  return updatedTasks.find((task) => task.id === id) ?? null;
};

export const deleteTask = async (id) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.filter((task) => task.id !== id);
  await saveTasks(updatedTasks);
};

export const clearAll = async () => {
  await AsyncStorage.removeItem(TASKS_KEY);
};

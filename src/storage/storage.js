import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, taskCollection } from './Firestore';
import { STORAGE_KEY } from '../utils/constants';

const shouldUseFirestore = () => isFirebaseConfigured && db && taskCollection;

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const getLocalTasks = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLocalTasks = async (tasks) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const getTasks = async () => {
  try {
    if (!shouldUseFirestore()) {
      return await getLocalTasks();
    }

    const tasksQuery = query(taskCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((taskDoc) => ({
      id: taskDoc.id,
      ...taskDoc.data(),
    }));
  } catch (error) {
    console.error('Error al obtener tareas en firestore:', error);
    return [];
  }
};

export const getTaskById = async (taskId) => {
  const tasks = await getTasks();
  return tasks.find((task) => task.id === taskId) ?? null;
};

export const addTask = async (taskData) => {
  try {
    if (!shouldUseFirestore()) {
      const tasks = await getLocalTasks();
      const newTask = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        completed: false,
      };

      await saveLocalTasks([newTask, ...tasks]);
      return newTask;
    }

    const docRef = await addDoc(taskCollection, {
      ...taskData,
      createdAt: serverTimestamp(),
      completed: false,
    });

    return await getTaskById(docRef.id);
  } catch (error) {
    console.error('Error al agregar tarea en firestore:', error);
    return null;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    if (!shouldUseFirestore()) {
      const tasks = await getLocalTasks();
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...taskData, id: taskId } : task
      );

      await saveLocalTasks(updatedTasks);
      return updatedTasks.find((task) => task.id === taskId) ?? null;
    }

    await updateDoc(doc(db, 'tasks', taskId), taskData);
    return await getTaskById(taskId);
  } catch (error) {
    console.error('Error al actualizar tarea en firestore:', error);
    return null;
  }
};

export const deleteTask = async (taskId) => {
  try {
    if (!shouldUseFirestore()) {
      const tasks = await getLocalTasks();
      await saveLocalTasks(tasks.filter((task) => task.id !== taskId));
      return true;
    }

    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error al eliminar tarea en firestore:', error);
    return false;
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error al limpiar tareas locales:', error);
    return false;
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import {Task} from "@/types/task";

const STORAGE_KEY = 'tasks'

export async function loadTasks() {
  try {
    const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (tasksJson) {
      const loadedTasks = JSON.parse(tasksJson);
      loadedTasks.forEach((task: Task) => {
        task.reminderTime = new Date(task.reminderTime);
      });

      return loadedTasks
    }
  } catch (error) {
    throw new Error(`Error loading tasks: ${(error as Error).message}`);
  }
}

export async function saveTasks(updatedTasks: Task[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}
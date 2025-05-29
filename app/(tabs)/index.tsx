import React, {useEffect, useState} from 'react';
import {Alert, Button, FlatList, StyleSheet} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import AppInput from "@/components/AppInput";
import {Task} from "@/types/task";
import {AppSelectDate} from "@/components/AppDatePicker";
import {loadTasks, saveTasks} from "@/utils/storage";
import {send, cancel} from "@/utils/onesignal";
import {TaskItem} from "@/components/TaskItem";


export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());

  useEffect(() => {
    async function fetchTasks() {
      try {
        const savedTasks = await loadTasks();
        if (savedTasks) {
          setTasks(savedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        Alert.alert('Error', 'Failed to load tasks');
      }
    }

    void fetchTasks();
  }, []);

  async function scheduleNotification(task: Task) {
    try {
      const {data} = await send(task.title, task.description, task.reminderTime);
      return data?.id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async function cancelNotification(notificationId: string) {
    try {
      await cancel(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async function addTask() {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      reminderTime,
    };

    const notificationId = await scheduleNotification(newTask);
    if (notificationId) {
      newTask.notificationId = notificationId;
    }

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    setTitle('');
    setDescription('');
    setReminderTime(new Date());
  }

  async function deleteTask(id: string) {
    const taskToDelete = tasks.find(task => task.id === id);

    if (taskToDelete?.notificationId) {
      await cancelNotification(taskToDelete.notificationId);
    }

    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>📝To-Do Reminder</ThemedText>

      <ThemedView style={styles.form}>
        <AppInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />

        <AppInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <AppSelectDate
          value={reminderTime}
          onChange={(date) => {
            if (date) setReminderTime(date);
          }}
        />

        <Button
          title="Create"
          onPress={() => addTask()}
        />
      </ThemedView>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onDelete={deleteTask} />
        )}
        style={styles.taskList}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>No tasks yet. Add one above!</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  taskList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
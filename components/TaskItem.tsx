import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Task} from "@/types/task";
import TaskItemDeleteButton from "@/components/TaskItemDeleteButton";
import TaskItemContent from "@/components/TaskItemContent";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskItem({task, onDelete}: TaskItemProps) {
  return (
    <View style={styles.container}>
      <TaskItemContent {...task} />
      <TaskItemDeleteButton handleDelete={() => onDelete(task.id)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
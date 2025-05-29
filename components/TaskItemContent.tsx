import {StyleSheet, Text, View} from "react-native";
import {formatTodoDate} from "@/utils/date";
import React from "react";

interface TaskItemContentProps {
  title: string;
  description: string;
  reminderTime: Date;
}

export default function TaskItemContent({title, description, reminderTime}: TaskItemContentProps) {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>
          {description}
        </Text>
      ) : null}
      <Text style={styles.time}>
        {formatTodoDate(reminderTime)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
  },
})
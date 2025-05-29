import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import React from "react";

interface TaskItemDeleteButtonProps {
  handleDelete: () => void;
}

export default function TaskItemDeleteButton({handleDelete}: TaskItemDeleteButtonProps) {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={handleDelete}
    >
      <Text style={styles.deleteButtonText}>
        <FontAwesome name="trash-o" size={24} color="white"/>
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#ff4444',
    borderRadius: 6,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})
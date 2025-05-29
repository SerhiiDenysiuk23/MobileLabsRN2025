import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { FileSystemEntry } from '@/services/FileSystemService';

interface FileListProps {
  entries: FileSystemEntry[];
  onEntryPress: (entry: FileSystemEntry) => void;
  onDeletePress: (entry: FileSystemEntry) => void;
  onInfoPress: (entry: FileSystemEntry) => void;
}

export const FileList: React.FC<FileListProps> = ({ entries, onEntryPress, onDeletePress, onInfoPress }) => {
  const renderItem = ({ item }: { item: FileSystemEntry }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.itemTouchable}
          onPress={() => onEntryPress(item)}
        >
          <ThemedView style={styles.itemContent}>
            <Ionicons
              name={item.isDirectory ? 'folder' : 'document'}
              size={24}
              color={item.isDirectory ? '#FFD700' : '#A9A9A9'}
              style={styles.icon}
            />
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onInfoPress(item)}
        >
          <Ionicons name="information-circle-outline" size={22} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDeletePress(item)}
        >
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  if (entries.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>This folder is empty</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={(item) => item.uri}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemTouchable: {
    flex: 1,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
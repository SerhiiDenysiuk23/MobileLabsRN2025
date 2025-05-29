import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, View, TextInput, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { fileSystemService } from '@/services/FileSystemService';

interface TextFileViewerProps {
  visible: boolean;
  filePath: string;
  fileName: string;
  onClose: () => void;
}

export const TextFileViewer: React.FC<TextFileViewerProps> = ({
                                                                visible,
                                                                filePath,
                                                                fileName,
                                                                onClose,
                                                              }) => {
  const [content, setContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible && filePath) {
      loadFileContent();
      setIsEditing(false);
    }
  }, [visible, filePath]);

  const loadFileContent = async () => {
    try {
      setLoading(true);
      setError('');
      const fileContent = await fileSystemService.readTextFile(filePath);
      setContent(fileContent);
      setEditedContent(fileContent);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to read file');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      await fileSystemService.updateTextFile(filePath, editedContent);
      setContent(editedContent);
      setIsEditing(false);
      Alert.alert('Success', 'File saved successfully');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save file');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            {fileName}
          </ThemedText>
          <View style={styles.headerButtons}>
            {!isEditing && (
              <TouchableOpacity onPress={handleEdit} style={styles.actionButton} disabled={loading}>
                <Ionicons name="create-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : isEditing ? (
            <>
              <TextInput
                style={styles.textInput}
                multiline
                value={editedContent}
                onChangeText={setEditedContent}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <ThemedText>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <ScrollView style={styles.scrollView}>
              <ThemedText style={styles.content}>{content}</ThemedText>
            </ScrollView>
          )}
        </View>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 200,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#CCCCCC',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
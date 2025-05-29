import React, {useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';

interface Props {
  visible: boolean;
  itemName: string;
  isDirectory: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export const DeleteConfirmationDialog: React.FC<Props> = ({visible, itemName, isDirectory, onClose, onDelete}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      await onDelete();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle" style={styles.title}>Delete {isDirectory ? 'folder' : 'file'}</ThemedText>
          <ThemedText style={styles.message}>Delete "{itemName}"?</ThemedText>
          {error && <ThemedText style={styles.error}>{error}</ThemedText>}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={onClose} disabled={loading}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.delete} onPress={handleDelete} disabled={loading}>
              {loading ? <ActivityIndicator/> : <ThemedText style={styles.deleteText}>Delete</ThemedText>}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'},
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  title: {textAlign: 'center', marginBottom: 10},
  message: {textAlign: 'center', marginBottom: 15},
  error: {color: 'red', textAlign: 'center', marginBottom: 10},
  buttons: {flexDirection: 'row', justifyContent: 'space-between'},
  cancel: {flex: 1, marginRight: 10, padding: 10, borderRadius: 5, backgroundColor: '#ccc', alignItems: 'center'},
  delete: {flex: 1, padding: 10, borderRadius: 5, backgroundColor: '#d9534f', alignItems: 'center'},
  deleteText: {color: '#fff'}
});
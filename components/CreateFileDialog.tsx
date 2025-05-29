import React, {useState} from 'react';
import {Modal, StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, content: string) => Promise<void>;
}

export const CreateFileDialog: React.FC<Props> = ({visible, onClose, onCreate}) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName('');
    setContent('');
    setError(null);
  };

  const handleCreate = async () => {
    if (!name.trim()) return setError('Input file name');
    setError(null);
    setLoading(true);
    try {
      await onCreate(name.trim(), content);
      reset();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle" style={styles.title}>New file</ThemedText>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} autoFocus/>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Content" value={content}
                     onChangeText={setContent} multiline/>
          {error && <ThemedText style={styles.error}>{error}</ThemedText>}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={() => {
              reset();
              onClose();
            }} disabled={loading}>
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.create} onPress={handleCreate} disabled={loading}>
              {loading ? <ActivityIndicator/> : <ThemedText style={styles.createText}>Create</ThemedText>}
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
  input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15},
  textArea: {height: 100, textAlignVertical: 'top'},
  error: {color: 'red', textAlign: 'center', marginBottom: 10},
  buttons: {flexDirection: 'row', justifyContent: 'space-between'},
  cancel: {flex: 1, marginRight: 10, padding: 10, borderRadius: 5, backgroundColor: '#ccc', alignItems: 'center'},
  create: {flex: 1, padding: 10, borderRadius: 5, backgroundColor: '#28a745', alignItems: 'center'},
  createText: {color: '#fff'}
});
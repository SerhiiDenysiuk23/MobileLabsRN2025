import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, View, ScrollView, Pressable, ActivityIndicator, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';
import {fileSystemService} from '@/services/FileSystemService';

interface Props {
  visible: boolean;
  filePath: string;
  onClose: () => void;
}

export const FileDetailsDialog: React.FC<Props> = ({visible, filePath, onClose}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fileSystemService.getFileDetails(filePath)
      .then(d => setDetails(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [visible, filePath]);

  const fmtSize = (bytes: number) => {
    const unit = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < unit.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${unit[i]}`;
  };
  const fmtDate = (ts: number) => ts ? new Date(ts).toLocaleString() : '—';

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="headline" style={styles.title}>Details</ThemedText>
            <Pressable onPress={onClose} style={styles.closeIcon} hitSlop={8}>
              <Ionicons name="close" size={24} color="#007AFF"/>
            </Pressable>
          </View>
          {loading && <ActivityIndicator size="large" style={styles.loader}/>}
          {error && <ThemedText style={styles.error}>{error}</ThemedText>}
          {details && (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {Object.entries(details).map(([key, value]) => (
                <View style={styles.row} key={key}>
                  <ThemedText style={styles.label}>{key}:</ThemedText>
                  <ThemedText
                    style={styles.value}>{key === 'size' ? fmtSize(value) : key === 'modificationTime' ? fmtDate(value) : String(value)}</ThemedText>
                </View>
              ))}
            </ScrollView>
          )}
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <ThemedText style={styles.closeText}>Close</ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'},
  content: {width: '85%', maxHeight: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 16},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  title: {fontSize: 20, fontWeight: '600'},
  closeIcon: {padding: 8},
  loader: {marginVertical: 20},
  error: {color: 'red', textAlign: 'center', marginVertical: 20},
  body: {marginBottom: 16},
  row: {flexDirection: 'row', marginVertical: 6},
  label: {flex: 1, fontWeight: '500'},
  value: {flex: 2, textAlign: 'right'},
  closeBtn: {backgroundColor: '#007AFF', padding: 12, borderRadius: 6, alignItems: 'center'},
  closeText: {color: '#fff', fontWeight: '600'},
});
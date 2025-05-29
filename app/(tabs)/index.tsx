import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ActivityIndicator, View, Text} from 'react-native';
import {ThemedView} from '@/components/ThemedView';
import {FileList} from '@/components/FileList';
import {PathDisplay} from '@/components/PathDisplay';
import {NavigationControls} from '@/components/NavigationControls';
import {CreateFolderDialog} from '@/components/CreateFolderDialog';
import {CreateFileDialog} from '@/components/CreateFileDialog';
import {TextFileViewer} from '@/components/TextFileViewer';
import {DeleteConfirmationDialog} from '@/components/DeleteConfirmationDialog';
import {FileDetailsDialog} from '@/components/FileDetailsDialog';
import {MemoryStats} from '@/components/MemoryStats';
import {useFileSystem} from '@/hooks/useFileSystem';
import {fileSystemService} from '@/services/FileSystemService';
import {FileSystemEntry} from '@/services/FileSystemService';

export default function HomeScreen() {
  const {currentPath, entries, loading, error, basePath, canGoUp, goUp, refresh, load} = useFileSystem();

  const [dialogs, setDialogs] = useState({folder: false, file: false, viewer: false, delete: false, details: false});
  const [activeEntry, setActiveEntry] = useState<FileSystemEntry | { path: string; name: string } | null>(null);

  const toggle = (key: keyof typeof dialogs, entry: any = null) => {
    setActiveEntry(entry);
    setDialogs(prev => ({...prev, [key]: !prev[key]}));
  };

  const onEntryPress = (entry: FileSystemEntry) => {
    if (entry.isDirectory) load(entry.uri);
    else if (entry.name.endsWith('.txt')) {
      setActiveEntry({path: entry.uri, name: entry.name});
      setDialogs(prev => ({...prev, viewer: true}));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <MemoryStats/>
        <PathDisplay currentPath={currentPath} basePath={basePath}/>
        <NavigationControls
          canGoUp={canGoUp}
          onGoUp={goUp}
          onRefresh={refresh}
          onCreateFolder={() => toggle('folder')}
          onCreateFile={() => toggle('file')}
        />

        {loading ? (
          <View style={styles.loading}><ActivityIndicator size="large"/></View>
        ) : error ? (
          <Text style={styles.error}>Error: {error.message}</Text>
        ) : (
          <FileList
            entries={entries}
            onEntryPress={onEntryPress}
            onDeletePress={entry => toggle('delete', entry)}
            onInfoPress={entry => toggle('details', entry)}
          />
        )}
      </ThemedView>

      <CreateFolderDialog
        visible={dialogs.folder}
        onClose={() => toggle('folder')}
        onCreate={async name => {
          await fileSystemService.createFolder(currentPath, name);
          await refresh();
        }}
      />

      <CreateFileDialog
        visible={dialogs.file}
        onClose={() => toggle('file')}
        onCreate={async (name, content) => {
          await fileSystemService.createTextFile(currentPath, name, content);
          await refresh();
        }}
      />

      {activeEntry && 'path' in activeEntry && (
        <TextFileViewer
          visible={dialogs.viewer}
          filePath={activeEntry.path}
          fileName={activeEntry.name}
          onClose={() => toggle('viewer')}
        />
      )}

      {activeEntry && 'isDirectory' in activeEntry && (
        <DeleteConfirmationDialog
          visible={dialogs.delete}
          itemName={activeEntry.name}
          isDirectory={activeEntry.isDirectory}
          onClose={() => toggle('delete')}
          onDelete={async () => {
            await fileSystemService.deleteEntry(activeEntry.uri);
            await refresh();
          }}
        />
      )}

      <FileDetailsDialog
        visible={dialogs.details}
        filePath={activeEntry && 'uri' in activeEntry ? activeEntry.uri : ''}
        onClose={() => toggle('details')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {flex: 1, padding: 12},
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  error: {color: 'red', textAlign: 'center', marginTop: 20},
});

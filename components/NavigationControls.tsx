import React from 'react';
import { StyleSheet, Pressable, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';

interface Props {
  canGoUp: boolean;
  onGoUp: () => void;
  onRefresh: () => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export const NavigationControls: React.FC<Props> = ({ canGoUp, onGoUp, onRefresh, onCreateFolder, onCreateFile }) => {
  const icons = [
    { action: onGoUp, icon: 'arrow-back-circle', disabled: !canGoUp, label: 'Back' },
    { action: onRefresh, icon: 'refresh-circle', disabled: false, label: 'Refresh' },
    { action: onCreateFolder, icon: 'folder-sharp', disabled: false, label: 'New Folder' },
    { action: onCreateFile, icon: 'document-outline', disabled: false, label: 'New File' },
  ];

  return (
    <ThemedView style={styles.container}>
      {icons.map(({ action, icon, disabled, label }) => (
        <Pressable
          key={icon}
          onPress={action}
          disabled={disabled}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
          accessibilityLabel={label}
        >
          <Ionicons name={icon as any} size={28} color={disabled ? '#A0A0A0' : '#007AFF'} />
        </Pressable>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'space-around',
  },
  button: {
    padding: 12,
    borderRadius: 8,
  },
  pressed: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  disabled: {
    opacity: 0.4,
  },
});
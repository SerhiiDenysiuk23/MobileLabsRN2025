import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface PathDisplayProps {
  currentPath: string;
  basePath: string;
}

export const PathDisplay: React.FC<PathDisplayProps> = ({ currentPath, basePath }) => {
  const formatPath = () => {
    if (currentPath === basePath) {
      return 'Home';
    }

    let displayPath = currentPath.replace(basePath, '');
    if (displayPath.endsWith('/')) {
      displayPath = displayPath.slice(0, -1);
    }

    return `Home/${displayPath}`;
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.pathText}>
        {formatPath()}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pathText: {
    fontSize: 16,
  },
});
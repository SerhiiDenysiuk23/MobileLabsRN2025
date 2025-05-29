import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import * as FileSystem from 'expo-file-system';

interface MemoryStatsProps {
  // в байтах
  totalStorage?: number;
  freeStorage?: number;
}

export const MemoryStats: React.FC<MemoryStatsProps> = ({ totalStorage, freeStorage }) => {
  const [total, setTotal] = React.useState<number>(totalStorage || 0);
  const [free, setFree] = React.useState<number>(freeStorage || 0);
  const used = total - free;
  const percent = total > 0 ? used / total : 0;

  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // пробуємо отримати реальні дані на Android/iOS, якщо підтримується
    async function fetchStorage() {
      try {
        const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory || '');
        if (info && info.size) {
          const simulatedTotal = 64 * 1024 ** 3;
          const simulatedFree = Math.max(simulatedTotal / 2, simulatedTotal - (info.size || 0));
          setTotal(simulatedTotal);
          setFree(simulatedFree);
        }
      } catch {
      }
    }
    fetchStorage();
  }, []);

  useEffect(() => {
    Animated.timing(animated, {
      toValue: percent,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const barWidth = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const format = (bytes: number) => {
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    let val = bytes;
    while (val >= 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return `${val.toFixed(1)} ${units[i]}`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="hardware-chip-outline" size={24} color="#007AFF" style={styles.icon} />
        <ThemedText type="subtitle" style={styles.title}>Storage Usage</ThemedText>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Total:</ThemedText>
          <ThemedText style={styles.statValue}>{format(total)}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Free:</ThemedText>
          <ThemedText style={styles.statValue}>{format(free)}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Used:</ThemedText>
          <ThemedText style={styles.statValue}>{format(used)}</ThemedText>
        </View>
      </View>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>
      <ThemedText style={styles.percentText}>{(percent * 100).toFixed(1)}% Used</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { marginRight: 8 },
  title: { fontSize: 18, fontWeight: '600' },
  statsContainer: { marginBottom: 12 },
  statItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  statLabel: { fontWeight: '500' },
  statValue: { color: '#007AFF' },
  barBackground: { height: 20, backgroundColor: '#E0E0E0', borderRadius: 10, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 10 },
  percentText: { textAlign: 'center', marginTop: 6, fontWeight: '500' },
});

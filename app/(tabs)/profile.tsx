import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useTask } from '@/hooks/useTask';

const taskList = [
  { id: 'tap10', label: 'Зробити 10 кліків', goal: 10 },
  { id: 'doubleTap5', label: '5 подвійних кліків', goal: 5 },
  { id: 'longPress', label: 'Утримати 3 секунди', goal: 1 },
  { id: 'pan', label: 'Перетягнути обʼєкт', goal: 1 },
  { id: 'swipeRight', label: 'Свайп вправо', goal: 1 },
  { id: 'swipeLeft', label: 'Свайп вліво', goal: 1 },
  { id: 'pinch', label: 'Змінити розмір', goal: 1 },
  { id: 'score100', label: 'Отримати 100 очок', goal: 100 },
];

export default function Profile() {
  const { score, taskProgress, resetTasks } = useTask();

  const renderItem = ({ item }: { item: typeof taskList[0] }) => {
    const progress = taskProgress[item.id] || 0;
    const completed = item.id === 'score100'
      ? score >= item.goal
      : progress >= item.goal;

    return (
      <View style={styles.taskItem}>
        <Text style={{ color: completed ? 'lightgreen' : 'white' }}>
          {completed ? '✅' : '❌'} {item.label} (
          {item.id === 'score100'
            ? Math.min(score, item.goal)
            : Math.min(progress, item.goal)
          }/{item.goal})
        </Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        {/* Reset-кнопка */}
        <View style={styles.resetContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetTasks}>
            <Text style={styles.resetButtonText}>Скинути всі завдання</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={taskList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      </ParallaxScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  resetContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskItem: {
    paddingVertical: 6,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

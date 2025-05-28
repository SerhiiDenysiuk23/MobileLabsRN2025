import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, View, Text, Animated as RNAnimated } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useTask } from '@/hooks/useTask';

const pugImage = 'https://i.redd.it/4znlt0iqb7r61.jpg';

export default function HomeScreen() {
  const { score, incrementTask } = useTask();

  // трансформації
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const animatedContainer = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // React-state для фідбеку
  const [feedback, setFeedback] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  // очистка таймера
  useEffect(() => {
    let tid: number;
    if (visible) {
      tid = setTimeout(() => setVisible(false), 800);
    }
    return () => clearTimeout(tid);
  }, [visible]);

  const showFeedback = useCallback((label: string) => {
    setFeedback(label);
    setVisible(true);
  }, []);

  const hit = (id: string, pts: number, label: string) => {
    incrementTask(id, pts);
    showFeedback(label);
  };

  // жести
  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => runOnJS(hit)('tap10', 1, 'Tap'));

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => runOnJS(hit)('doubleTap5', 2, 'Double Tap'));

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => runOnJS(hit)('longPress', 5, 'Long Press'));

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .numberOfPointers(1)
    .onEnd(() => runOnJS(hit)('swipeLeft', Math.floor(Math.random() * 10) + 1, 'Swipe ←'));

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .numberOfPointers(1)
    .onEnd(() => runOnJS(hit)('swipeRight', Math.floor(Math.random() * 10) + 1, 'Swipe →'));

  const pan = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => runOnJS(hit)('pan', 1, 'Pan'));

  const pinch = Gesture.Pinch()
    .onUpdate(e => (scale.value = e.scale))
    .onEnd(() => runOnJS(hit)('pinch', 3, 'Pinch'));

  const composed = Gesture.Exclusive(
    flingLeft,
    flingRight,
    pinch,
    pan,
    doubleTap,
    singleTap,
    longPress
  );

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
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Pug</ThemedText>
        </ThemedView>

        <ThemedView style={styles.newsContainer}>
          <GestureDetector gesture={composed}>
            <Animated.View style={[styles.newsImage, animatedContainer]}>
              <Image
                source={{ uri: pugImage }}
                style={StyleSheet.absoluteFill}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Очки: {score}</Text>
          </View>

          {visible && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          )}
        </ThemedView>
      </ParallaxScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  newsContainer: {
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
  newsImage: {
    width: '100%',
    height: 320,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scoreContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  feedbackContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

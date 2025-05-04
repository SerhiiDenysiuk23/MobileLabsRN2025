import {Image, StyleSheet, View} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';

const newsData = [
  {
    title: 'Breaking News',
    image: "https://picsum.photos/320/220",
    summary: 'This is a short summary of the breaking news.',
  },
  {
    title: 'Tech Update',
    image: "https://picsum.photos/321/221",
    summary: 'Latest advancements in technology you should know.',
  },
  {
    title: 'Sports Highlights',
    image: "https://picsum.photos/323/223",
    summary: 'Top moments from recent sports events.',
  },
];

export default function HomeScreen() {
  return (
    <ParallaxScrollView headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}} headerImage={<Image
      source={require('@/assets/images/partial-react-logo.png')}
      style={styles.reactLogo}
    />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">News</ThemedText>
      </ThemedView>
      <ThemedView style={styles.newsContainer}>
        {newsData.map((news, index) => (
          <View key={index} style={styles.newsItem}>
            <Image src={news.image} style={styles.newsImage}/>
            <View>
              <ThemedText style={styles.textContainer} type="subtitle">{news.title}</ThemedText>
              <ThemedText style={styles.textContainer}>{news.summary}</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  newsContainer: {
    flexDirection: 'column',
    gap: 16
  },
  newsItem: {
    backgroundColor: 'rgba(220,220,222,0.65)',
    borderRadius: 8,
    flexDirection: "row",
    padding: 10,
    gap: 10
  },
  newsImage: {
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    objectFit: 'cover',
    aspectRatio: 1
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  textContainer: {
    flexWrap: "wrap",
    maxWidth: "92%"
  }
});

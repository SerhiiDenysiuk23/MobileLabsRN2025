import {StyleSheet, Image, View} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const imagePaths = [
  "https://picsum.photos/300/200",
  "https://picsum.photos/301/201",
  "https://picsum.photos/302/202",
  "https://picsum.photos/303/203",
  "https://picsum.photos/304/204",
  "https://picsum.photos/305/205",
  "https://picsum.photos/306/206",
  "https://picsum.photos/307/207",
  "https://picsum.photos/308/208",
  "https://picsum.photos/309/209",
  "https://picsum.photos/310/210",
  "https://picsum.photos/311/211"
];
export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}/>
      }>

      <View style={styles.galleryContainer}>
        {imagePaths.map((imagePath, index) => (
          <View key={index} style={styles.imageCard}>
            <Image src={imagePath} style={styles.image}/>
          </View>
        ))}
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0,
    justifyContent: 'space-between',
  },
  imageCard: {
    width: '48%', // Two columns with slight gap
    aspectRatio: "2 / 1.5", // Square images for consistency
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

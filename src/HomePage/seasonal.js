

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import FastImage from 'react-native-fast-image';

const Seasonal = () => {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation(); // Initialize the navigation hook

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://139.59.68.117:4000/api/new?page=1&limit=2'); // Adjust limit as needed
        const data = await response.json();
        const formattedData = data.map(item => ({
          id: item.id,
          uri: item.images[0], // Access the first image in the images array
          label: `Image ${item.id}`, // Label based on the image ID or any other property
        }));
        console.log('Formatted Data:', formattedData); // Debugging
        setPhotos(formattedData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Wrap the image with TouchableOpacity to make it clickable */}
      <TouchableOpacity onPress={() => navigation.navigate('New', { itemId: item.id })}>
        <FastImage
          style={styles.image}
          source={{ uri: item.uri }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>SEASONAL FAVS</Text>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={170} // Width of each image + marginRight
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 26,
    marginBottom: 15,
    color: '#000',
    fontWeight: '300',
  },
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 12,
  },
  image: {
    width: 170,
    height: 200,
    marginBottom: 5,
    borderRadius: 20,
  },
  imageLabel: {
    fontWeight: '400',
    color: '#000',
    fontSize: 11,
    marginLeft: 15,
  },
});

export default Seasonal;

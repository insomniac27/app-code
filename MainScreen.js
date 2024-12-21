//import React, { useEffect, useState, useRef } from 'react';
//import {
//  FlatList,
//  View,
//  Text,
//  StyleSheet,
//  Image,
//  Dimensions,
//  ActivityIndicator,
//  TouchableOpacity,
//} from 'react-native';
//import Header from './src/HomePage/header';
//import IconMenu from './src/HomePage/bottom';
//import Seasonal from './src/HomePage/seasonal';
//
//
//const { width } = Dimensions.get('window');
//
//const MainScreen = () => {
//  const [categories, setCategories] = useState([]);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//  const [activeIndex, setActiveIndex] = useState(0);
//
//  // Reference to the FlatList to programmatically scroll
//  const flatListRef = useRef(null);
//
//  useEffect(() => {
//    const fetchCategories = async () => {
//      try {
//        const response = await fetch('http://139.59.68.117:4000/api/homepage');
//        if (!response.ok) {
//          throw new Error(`HTTP error! status: ${response.status}`);
//        }
//        const data = await response.json();
//        setCategories(data); // Make sure categories is always set consistently
//      } catch (err) {
//        setError(err.message);
//      } finally {
//        setLoading(false);
//      }
//    };
//    fetchCategories();
//  }, []);
//
//  const onScroll = (event) => {
//    const index = Math.round(event.nativeEvent.contentOffset.x / width);
//    setActiveIndex(index);
//  };
//
//  const handleCategoryPress = (index) => {
//    setActiveIndex(index);
//    // Scroll to the corresponding index in the FlatList
//    flatListRef.current.scrollToIndex({ index, animated: true });
//  };
//
//  if (loading) {
//    return (
//      <View style={styles.loaderContainer}>
//        <ActivityIndicator size="large" color="#0000ff" />
//      </View>
//    );
//  }
//
//  if (error) {
//    return (
//      <View style={styles.errorContainer}>
//        <Text style={styles.errorText}>Error: {error}</Text>
//      </View>
//    );
//  }
//
//  return (
//    <View style={styles.container}>
//      <Header placeholder="Search here..." />
//
//      {/* Category Titles */}
//      <View style={styles.categoryTitles}>
//        {categories.map((item, index) => (
//          <TouchableOpacity key={index} onPress={() => handleCategoryPress(index)}>
//            <Text
//              style={[
//                styles.categoryText,
//                activeIndex === index ? styles.activeCategoryText : styles.inactiveCategoryText,
//              ]}
//            >
//              {item.title}
//            </Text>
//          </TouchableOpacity>
//        ))}
//      </View>
//
//      {/* FlatList for Images */}
//      <FlatList
//        ref={flatListRef}
//        data={categories}
//        horizontal
//        showsHorizontalScrollIndicator={false}
//        pagingEnabled
//        onScroll={onScroll}
//        scrollEventThrottle={16}
//        keyExtractor={(item) => item.id.toString()}
//        renderItem={({ item, index }) => (
//          <View style={styles.page}>
//            {item.images && item.images.length > 0 && (
//              <Image source={{ uri: item.images[0] }} style={styles.image} />
//            )}
//          </View>
//        )}
//      />
//      <Seasonal />
//
//      <IconMenu />
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    width: '100%'
//  },
//  loaderContainer: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  errorContainer: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  errorText: {
//    color: 'red',
//    fontSize: 18,
//  },
//  categoryTitles: {
//    flexDirection: 'row',
//    justifyContent: 'end',
//    marginTop: 10, // Reduced margin to remove space between titles and image
//    marginBottom: 10,
//  },
//  categoryText: {
//    fontSize: 18,
//    fontWeight: 'bold',
//    marginHorizontal: 15,
//  },
//  activeCategoryText: {
//    color: '#000', // Active category color
//  },
//  inactiveCategoryText: {
//    color: '#ccc', // Inactive category color
//
//  },
//  page: {
//    width,
////    alignItems: 'center',
////    justifyContent: 'center',
////    paddingVertical: 20,
//  },
//  title: {
//    fontSize: 24,
//    fontWeight: 'bold',
//    marginBottom: 10,
//    color: '#000',
//  },
//  image: {
//    width: '90%',
//    height: 400,
//    borderRadius: 10,
//    resizeMode: 'cover',
//  },
//});
//
//export default MainScreen;




import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from './src/HomePage/header';
import IconMenu from './src/HomePage/bottom';
import Seasonal from './src/HomePage/seasonal';
//
//const { width } = Dimensions.get('window');
//
//const MainScreen = () => {
//  const [categories, setCategories] = useState([]);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//  const [activeIndex, setActiveIndex] = useState(0);
//
//  const flatListRef = useRef(null);
//
//  useEffect(() => {
//    const fetchCategories = async () => {
//      try {
//        const response = await fetch('http://139.59.68.117:4000/api/homepage');
//        if (!response.ok) {
//          throw new Error(`HTTP error! status: ${response.status}`);
//        }
//        const data = await response.json();
//        setCategories(data);
//      } catch (err) {
//        setError(err.message);
//      } finally {
//        setLoading(false);
//      }
//    };
//    fetchCategories();
//  }, []);
//
//  const onScroll = (event) => {
//    const index = Math.round(event.nativeEvent.contentOffset.x / width);
//    setActiveIndex(index);
//  };
//
//  const handleCategoryPress = (index) => {
//    setActiveIndex(index);
//    flatListRef.current.scrollToIndex({ index, animated: true });
//  };
//
//  if (loading) {
//    return (
//      <View style={styles.loaderContainer}>
//        <ActivityIndicator size="large" color="#0000ff" />
//      </View>
//    );
//  }
//
//  if (error) {
//    return (
//      <View style={styles.errorContainer}>
//        <Text style={styles.errorText}>Error: {error}</Text>
//      </View>
//    );
//  }
//
//return (
//  <View style={styles.outerContainer}>
//    {/* Fixed Header */}
//    <Header style={styles.header} placeholder="Search here..." />
//
//    <ScrollView style={styles.scrollContainer}>
//      <View style={styles.container}>
//        <View style={styles.categoryTitles}>
//          {categories.map((item, index) => (
//            <TouchableOpacity key={index} onPress={() => handleCategoryPress(index)}>
//              <Text
//                style={[
//                  styles.categoryText,
//                  activeIndex === index ? styles.activeCategoryText : styles.inactiveCategoryText,
//                ]}
//              >
//                {item.title}
//              </Text>
//            </TouchableOpacity>
//          ))}
//        </View>
//
//        <FlatList
//          ref={flatListRef}
//          data={categories}
//          horizontal
//          showsHorizontalScrollIndicator={false}
//          pagingEnabled
//          onScroll={onScroll}
//          scrollEventThrottle={16}
//          keyExtractor={(item) => item.id.toString()}
//          renderItem={({ item }) => (
//            <View style={styles.page}>
//              {item.images && item.images.length > 0 && (
//                <Image source={{ uri: item.images[0] }} style={styles.image} />
//              )}
//            </View>
//          )}
//        />
//
//        <Seasonal />
//      </View>
//    </ScrollView>
//
//    {/* Fixed IconMenu */}
//    <IconMenu style={styles.iconMenu} />
//  </View>
//);
//
//};


const { width } = Dimensions.get('window');

const MainScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef(null);
  const navigation = useNavigation(); // Access navigation object

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://139.59.68.117:4000/api/homepage');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const onScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleCategoryPress = (index) => {
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  const handleImagePress = (category) => {
    // Navigate to Categories page with data
    navigation.navigate('Collection', { category });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* Fixed Header */}
      <Header style={styles.header} placeholder="Search here..." />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.categoryTitles}>
            {categories.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleCategoryPress(index)}>
                <Text
                  style={[
                    styles.categoryText,
                    activeIndex === index ? styles.activeCategoryText : styles.inactiveCategoryText,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            ref={flatListRef}
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleImagePress(item)}>
                <View style={styles.page}>
                  {item.images && item.images.length > 0 && (
                    <Image source={{ uri: item.images[0] }} style={styles.image} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />

          <Seasonal />
        </View>
      </ScrollView>

      {/* Fixed IconMenu */}
      <IconMenu style={styles.iconMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
    //marginBottom: 60, // Adjust to leave space for IconMenu
  },
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure Header stays on top
    backgroundColor: '#fff', // Optional for better visibility
    elevation: 5, // For shadow on Android
  },
  iconMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    //height: '10%', // Adjust height as needed
    backgroundColor: '#fff', // Optional for better visibility
    zIndex: 10, // Ensure IconMenu stays on top
    elevation: 5, // For shadow on Android
  },
  categoryTitles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeCategoryText: {
    color: '#000',
  },
  inactiveCategoryText: {
    color: '#ccc',
  },
  page: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: 400,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});


export default MainScreen;

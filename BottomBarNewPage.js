//bottom bar for new page
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';  // Import the faShoppingCart icon
import auth from '@react-native-firebase/auth'; // Import Firebase auth module




const onAddToCart = async (image, price, quantity, size, title, description) => {
  try {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      Alert.alert('User not found', 'Please login first.');
      return;
    }

    console.log('Retrieved USERID:', userId); // Debug log
    const userDocRef = firestore().collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      Alert.alert('User not found in Firestore', 'Please check your account.');
      return;
    }

    const currentCart = userDoc.data().cart || [];

    const apiUrl = `http://139.59.68.117:4000/api/new/?title=${encodeURIComponent(title)}`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl, { method: 'GET' });
    if (!response.ok) {
      console.error('Failed to fetch product availability...');
      Alert.alert('Error', 'Unable to fetch product availability.');
      return;
    }

    const responseData = await response.json();
    console.log('API Response Data:', responseData);

    // Find the product by title
    const product = responseData.find(item => item.title === title);
    if (!product) {
      Alert.alert('Error', 'Product not found in API response.');
      return;
    }

    const sizeKey = `quantity${size}`; // Dynamically determine size key
    const availableQuantity = product[sizeKey];

    console.log('Expected sizeKey:', sizeKey, 'Available Quantity:', availableQuantity);

    if (availableQuantity === undefined) {
      Alert.alert('Error', `Unable to fetch availability for size: ${size}`);
      return;
    }

    if (availableQuantity < quantity) {
      Alert.alert('Out of Stock', `Only ${availableQuantity} items available for size: ${size}`);
      return;
    }

    // Add product to cart logic here
    console.log('Adding to cart:', { image, price, quantity, size, title, description });

    // Example of adding the product to the Firestore cart
    const newCartItem = {
      image,
      price,
      quantity,
      size,
      title,
      description,
    };
    await userDocRef.update({
      cart: [...currentCart, newCartItem],
    });

    Alert.alert('Success', 'Item added to cart successfully.');
  } catch (error) {
    console.error('Error in onAddToCart:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};



const { width } = Dimensions.get('window');

const BottomBarNewPage = ({ image, price, quantity, size, title, description }) => {
  const navigation = useNavigation();

  const handlePress = (label) => {
    switch (label) {
      case 'cart':
        navigation.navigate('cart');
        break;
      case 'wishlist':
        navigation.navigate('Wishlist'); // Navigate to the Wishlist screen
        break;
      case 'Home':
        navigation.navigate('MainScreen');
        break;
      case 'New':
        onAddToCart(image, price, quantity, size, title, description);
        break;
       case 'Wishlist':
               navigation.navigate('wishlist');
      default:
//        Alert.alert(`added to ${label}`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => handlePress('Wishlist')}>
        <View style={styles.smallButton}>
                <FontAwesomeIcon icon={faHeart} size={25} color="#000" />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => handlePress('cart')}>
        <View style={styles.smallButton}>
      <FontAwesomeIcon icon={faShoppingCart} size={25} color="#000" />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => handlePress('New')}>
        <View style={styles.button}>
          <Text style={styles.text}>ADD TO CART</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* FlashMessage component to show alerts */}
      <FlashMessage position="top" />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  smallButton: {
    width: '10%',
    height: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginLeft: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '10%',
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 10,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  text: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});

export default BottomBarNewPage;

//import React, { useEffect, useState } from 'react';
//import { Text, View, FlatList, StyleSheet, Image, Alert } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
//import auth from '@react-native-firebase/auth';
//
//const Wishlist = () => {
//  const [wishlist, setWishlist] = useState([]);
//  const [loading, setLoading] = useState(true);
//
//  useEffect(() => {
//    const fetchWishlist = async () => {
//      const user = auth().currentUser;
//
//      if (!user) {
//        Alert.alert('Error', 'No user is signed in.');
//        setLoading(false);
//        return;
//      }
//
//      try {
//        const userDoc = await firestore().collection('users').doc(user.uid).get();
//        const userData = userDoc.data();
//
//        if (userData && userData.wishlist) {
//          setWishlist(userData.wishlist);
//        } else {
//          setWishlist([]);
//        }
//      } catch (error) {
//        console.error('Error fetching wishlist:', error);
//        Alert.alert('Error', 'Failed to fetch wishlist.');
//      } finally {
//        setLoading(false);
//      }
//    };
//
//    fetchWishlist();
//  }, []);
//
//  const renderWishlistItem = ({ item }) => (
//    <View style={styles.itemContainer}>
//      <Image source={{ uri: item.image }} style={styles.itemImage} />
//      <View style={styles.itemDetails}>
//        <Text style={styles.itemTitle}>{item.title}</Text>
//        <Text style={styles.itemDescription}>{item.description}</Text>
//        <Text style={styles.itemPrice}>{`Rs. ${item.price.toFixed(2)}`}</Text>
//        <Text style={styles.itemSize}>{`Size: ${item.size}`}</Text>
//        <Text style={styles.itemQuantity}>{`Quantity: ${item.quantity}`}</Text>
//      </View>
//    </View>
//  );
//
//  if (loading) {
//    return (
//      <View style={styles.center}>
//        <Text>Loading...</Text>
//      </View>
//    );
//  }
//
//  if (wishlist.length === 0) {
//    return (
//      <View style={styles.center}>
//        <Text>Your wishlist is empty!</Text>
//      </View>
//    );
//  }
//
//  return (
//    <FlatList
//      data={wishlist}
//      keyExtractor={(item, index) => index.toString()}
//      renderItem={renderWishlistItem}
//      contentContainerStyle={styles.listContainer}
//    />
//  );
//};
//
//const styles = StyleSheet.create({
//  center: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  listContainer: {
//    padding: 16,
//  },
//  itemContainer: {
//    flexDirection: 'row',
//    marginBottom: 16,
//    padding: 12,
//    backgroundColor: '#f9f9f9',
//    borderRadius: 8,
//    shadowColor: '#000',
//    shadowOpacity: 0.1,
//    shadowRadius: 4,
//    elevation: 2,
//  },
//  itemImage: {
//    width: 80,
//    height: 80,
//    borderRadius: 8,
//    marginRight: 12,
//  },
//  itemDetails: {
//    flex: 1,
//    justifyContent: 'space-between',
//  },
//  itemTitle: {
//    fontSize: 16,
//    fontWeight: 'bold',
//    color: '#333',
//  },
//  itemDescription: {
//    fontSize: 14,
//    color: '#666',
//  },
//  itemPrice: {
//    fontSize: 14,
//    fontWeight: 'bold',
//    color: '#000',
//  },
//  itemSize: {
//    fontSize: 14,
//    color: '#555',
//  },
//  itemQuantity: {
//    fontSize: 14,
//    color: '#777',
//  },
//});
//
//export default Wishlist;



//import React, { useEffect, useState } from 'react';
//import { Text, View, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
//import auth from '@react-native-firebase/auth';
//
//const Wishlist = ({ navigation }) => {
//  const [wishlist, setWishlist] = useState([]);
//  const [loading, setLoading] = useState(true);
//
//  // Fetch wishlist from Firestore
//  useEffect(() => {
//    const fetchWishlist = async () => {
//      const user = auth().currentUser;
//
//      if (!user) {
//        Alert.alert('Error', 'No user is signed in.');
//        setLoading(false);
//        return;
//      }
//
//      try {
//        const userDoc = await firestore().collection('users').doc(user.uid).get();
//        const userData = userDoc.data();
//
//        if (userData && userData.wishlist) {
//          setWishlist(userData.wishlist);
//        } else {
//          setWishlist([]); // Empty wishlist if no data is found
//        }
//      } catch (error) {
//        console.error('Error fetching wishlist:', error);
//        Alert.alert('Error', 'Failed to fetch wishlist.');
//      } finally {
//        setLoading(false);
//      }
//    };
//
//    fetchWishlist();
//  }, []);
//
//  // Handle item press to add to cart
//  const handleItemPress = async (item) => {
//    if (!item) {
//      console.error('Item is undefined or null');
//      return;
//    }
//
//    const user = auth().currentUser;
//    if (!user) {
//      Alert.alert('Error', 'No user is signed in.');
//      return;
//    }
//
//    try {
//      // Fetch current cart from Firestore
//      const userRef = firestore().collection('users').doc(user.uid);
//      const userDoc = await userRef.get();
//      const userData = userDoc.data();
//
//      // Initialize cart if not present
//      const cart = userData?.cart || [];
//
//      // Add the new item to the cart
//      const updatedCart = [...cart, item];
//      await userRef.update({ cart: updatedCart });
//
//      Alert.alert('Success', `${item.title} has been added to your cart.`);
//    } catch (error) {
//      console.error('Error adding item to cart:', error);
//      Alert.alert('Error', 'Failed to add item to the cart.');
//    }
//  };
//
//  // Render each wishlist item
//  const renderWishlistItem = ({ item }) => {
//    if (!item) {
//      console.error('Item is undefined or null in renderWishlistItem');
//      return null;
//    }
//
//    return (
//      <TouchableOpacity
//        style={styles.itemContainer}
//        onPress={() => handleItemPress(item)} // Add to cart on press
//      >
//        <Image source={{ uri: item.image }} style={styles.itemImage} />
//        <View style={styles.itemDetails}>
//          <Text style={styles.itemTitle}>{item.title}</Text>
//          <Text style={styles.itemDescription}>{item.description}</Text>
//          <Text style={styles.itemPrice}>{`Rs. ${item.price.toFixed(2)}`}</Text>
//          <Text style={styles.itemSize}>{`Size: ${item.size}`}</Text>
//          <Text style={styles.itemQuantity}>{`Quantity: ${item.quantity}`}</Text>
//        </View>
//      </TouchableOpacity>
//    );
//  };
//
//  // Display loading indicator
//  if (loading) {
//    return (
//      <View style={styles.center}>
//        <Text>Loading...</Text>
//      </View>
//    );
//  }
//
//  // If wishlist is empty
//  if (wishlist.length === 0) {
//    return (
//      <View style={styles.center}>
//        <Text>Your wishlist is empty!</Text>
//      </View>
//    );
//  }
//
//  return (
//    <FlatList
//      data={wishlist}
//      keyExtractor={(item, index) => index.toString()}
//      renderItem={renderWishlistItem}
//      contentContainerStyle={styles.listContainer}
//    />
//  );
//};
//
//const styles = StyleSheet.create({
//  center: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  listContainer: {
//    padding: 16,
//  },
//  itemContainer: {
//    flexDirection: 'row',
//    marginBottom: 16,
//    padding: 12,
//    backgroundColor: '#f9f9f9',
//    borderRadius: 8,
//    shadowColor: '#000',
//    shadowOpacity: 0.1,
//    shadowRadius: 4,
//    elevation: 2,
//  },
//  itemImage: {
//    width: 80,
//    height: 80,
//    borderRadius: 8,
//    marginRight: 12,
//  },
//  itemDetails: {
//    flex: 1,
//    justifyContent: 'space-between',
//  },
//  itemTitle: {
//    fontSize: 16,
//    fontWeight: 'bold',
//    color: '#333',
//  },
//  itemDescription: {
//    fontSize: 14,
//    color: '#666',
//  },
//  itemPrice: {
//    fontSize: 14,
//    fontWeight: 'bold',
//    color: '#000',
//  },
//  itemSize: {
//    fontSize: 14,
//    color: '#555',
//  },
//  itemQuantity: {
//    fontSize: 14,
//    color: '#777',
//  },
//});
//
//export default Wishlist;



import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Wishlist = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from Firestore
  useEffect(() => {
    const fetchWishlist = async () => {
      const user = auth().currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is signed in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch the signed-in user's document
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        if (userData && userData.wishlist) {
          setWishlist(userData.wishlist);
        } else {
          setWishlist([]); // Empty wishlist if no data is found
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        Alert.alert('Error', 'Failed to fetch wishlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Handle item press to add to cart
  const handleItemPress = async (item) => {
    if (!item) {
      console.error('Item is undefined or null');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is signed in.');
      return;
    }

    try {
      // Fetch current cart from Firestore
      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      // Initialize cart if not present
      const cart = userData?.cart || [];

      // Add the new item to the cart
      const updatedCart = [...cart, item];
      await userRef.update({ cart: updatedCart });

      Alert.alert('Success', `${item.title} has been added to your cart.`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert('Error', 'Failed to add item to the cart.');
    }
  };

  // Render each wishlist item
  const renderWishlistItem = ({ item }) => {
    if (!item) {
      console.error('Item is undefined or null in renderWishlistItem');
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)} // Add to cart on press
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>{`Rs. ${item.price.toFixed(2)}`}</Text>
          <Text style={styles.itemSize}>{`Size: ${item.size}`}</Text>
          <Text style={styles.itemQuantity}>{`Quantity: ${item.quantity}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Display loading indicator
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If wishlist is empty
  if (wishlist.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Your wishlist is empty!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wishlist}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderWishlistItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  itemSize: {
    fontSize: 14,
    color: '#555',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#777',
  },
});

export default Wishlist;


import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  // Function to fetch products based on the search query
  const fetchProducts = useCallback(async (query) => {
    try {
      const api1 = 'http://139.59.68.117:4000/api/new/';
      const api2 = 'http://139.59.68.117:4000/api/subcategory/';

      const [response1, response2] = await Promise.all([
        axios.get(api1, { params: { query } }),
        axios.get(api2, { params: { query } }),
      ]);

      const combinedProducts = [...response1.data, ...response2.data];

      const filteredResults = combinedProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredResults.length === 0) {
        setNoResultsMessage('No results found');
      } else {
        setNoResultsMessage('');
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  // Handle when the user presses Enter
  const handleSearchSubmit = () => {
    if (searchQuery.length > 0) {
      fetchProducts(searchQuery);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchProducts(searchQuery);
    } else {
      setSearchResults([]); // Clear results if search query is empty
      setNoResultsMessage(''); // Clear no results message
    }
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}  // Trigger search on Enter press
          returnKeyType="search"  // Change the return key to "Search" on iOS
        />

        {/* Wishlist Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('wishlist')}>
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon
              icon={faHeart}
              color="#000"
              size={20}
              style={styles.iconStyle}
            />
          </View>
        </TouchableOpacity>

        {/* Cart Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('cart')}>
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon
              icon={faShoppingCart}
              color="#000"
              size={20}
              style={styles.iconStyle}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <View style={[styles.resultsContainer, searchQuery.length > 0 && styles.searchActive]}>
        {searchQuery.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}  // Use a unique identifier like `id`
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { item })}>
                <View style={styles.resultItem}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productTitle}>{item.title}</Text>
                  <Text style={styles.productDescription}>{item.description}</Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noResultsMessage}>{noResultsMessage}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: '-100%'
  },
  searchBar: {
    height: 40,
    width: '78%',  // Fixed width for the search bar
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  iconWrapper: {
    marginLeft: 10,
  },
  iconStyle: {
    fontSize: 20,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20, // Add some space at the bottom of the results list
    paddingHorizontal: 15,  // Ensure results have margin/padding
  },
  searchActive: {
    paddingTop: 20,  // Adjust the padding to create space below the header only when active
  },
  resultItem: {
    padding: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 120, // Increased image size
    height: 120,
    marginRight: 20,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 24, // Larger font size for the title
  },
  productDescription: {
    fontSize: 18, // Larger font size for description
  },
  productPrice: {
    marginTop: 10,
    fontSize: 20, // Larger font size for the price
    color: '#000',
  },
  noResultsMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default Header;




//
//const styles = StyleSheet.create({
//  headerContainer: {
//    zIndex: 1000,
//    flexDirection: 'row',
//    alignItems: 'center', // Ensures all elements align vertically
//    paddingHorizontal: 15,
//    backgroundColor: '#fff',
//    height: 60, // Adjust header height for proper content spacing
//  },
//  searchBar: {
//    flex: 1,
//    height: 40, // Height adjusted to match the header's alignment
//    borderWidth: 1,
//    borderColor: '#ccc',
//    borderRadius: 5,
//    paddingHorizontal: 10,
//    fontSize: 16, // Ensures text is readable
//    backgroundColor: '#F9F9F9',
//    marginRight: 15,
//  },
//  iconStyle: {
//    marginHorizontal: 10,
//  },
//  iconWrapper: {
//    justifyContent: 'center',
//    alignItems: 'center',
//    height: 40, // Matches the height of the search bar for consistent alignment
//    width: 40, // Optional: Adds a fixed width for icons
//  },
//});
//
//export default Header;

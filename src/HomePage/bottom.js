
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUserCircle, faExclamation, faStar } from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

const BottomBar = () => {
  const navigation = useNavigation();
  const [activeIcon, setActiveIcon] = useState(null); // Track the active icon
  const isPressed = useRef(false); // Ref to manage debounce

  const handlePress = (label) => {
    if (isPressed.current) return; // Ignore subsequent presses
    isPressed.current = true; // Lock press

    // Unlock after 300ms to avoid double-tap issues
    setTimeout(() => {
      isPressed.current = false;
    }, 300);

    if (activeIcon !== label) {
      setActiveIcon(label); // Update active icon state
    }

    // Navigate based on label
    switch (label) {
      case 'Home':
        navigation.navigate('MainScreen');
        break;
      case 'Collection':
        navigation.navigate('Collection');
        break;
      case 'New':
        navigation.navigate('New');
        break;
      case 'Account':
        navigation.navigate('Account');
        break;
      default:
        break;
    }
  };

  // Render each button to prevent inline logic or duplication
  const renderButton = (label, icon) => {
    const isActive = activeIcon === label;
    return (
      <TouchableWithoutFeedback onPress={() => handlePress(label)}>
        <View style={styles.button}>
          <FontAwesomeIcon
            icon={icon}
            size={25}
            color={isActive ? '#000000' : '#000000'}
          />
          <Text style={[styles.text, isActive && styles.activeText]}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton('Home', faHome)}
      {renderButton('Collection', faStar)}
      {renderButton('New', faExclamation)}
      {renderButton('Account', faUserCircle)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    height: '7%',
    borderTopWidth: 1,
    borderColor: '#D3D3D3',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 5,
  },
  text: {
    marginTop: 5,
    fontSize: 12,
    color: '#000000',
  },
  activeText: {
    color: '#000000',
    //fontWeight: 'bold',
  },
});

export default BottomBar;




//
////import React from 'react';
////import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
////import Icon from 'react-native-vector-icons/MaterialIcons';
////import { useNavigation } from '@react-navigation/native';
////
////const { width } = Dimensions.get('window');
////
////const IconMenu = () => {
////  const navigation = useNavigation();
////
//  // Handler functions for button presses
//  const handlePress = (label) => {
//    if (label === 'Collections') {
//      navigation.navigate('Collections');
//    } else {
//      Alert.alert(`${label} Pressed`);
//    }
//  };
//
//  return (
//    <View style={styles.container}>
//      <TouchableWithoutFeedback onPress={() => handlePress('Home')}>
//        <View style={styles.button}>
//          <Icon name="home" size={30} color="#fff" />
//          <Text style={styles.text}>Home</Text>
//        </View>
//      </TouchableWithoutFeedback>
//      <TouchableWithoutFeedback onPress={() => handlePress('Collections')}>
//        <View style={styles.button}>
//          <Icon name="collections" size={30} color="#fff" />
//          <Text style={styles.text}>Collections</Text>
//        </View>
//      </TouchableWithoutFeedback>
//      <TouchableWithoutFeedback onPress={() => handlePress('New')}>
//        <View style={styles.button}>
//          <Icon name="new-releases" size={30} color="#fff" />
//          <Text style={styles.text}>New</Text>
//        </View>
//      </TouchableWithoutFeedback>
//      <TouchableWithoutFeedback onPress={() => handlePress('Account')}>
//        <View style={styles.button}>
//          <Icon name="account-circle" size={30} color="#fff" />
//          <Text style={styles.text}>Account</Text>
//        </View>
//      </TouchableWithoutFeedback>
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: {
//    flexDirection: 'row',
//    justifyContent: 'space-around', // Adjusted to space evenly
//    backgroundColor: '#333',
//  },
//  button: {
//    alignItems: 'center',
//    justifyContent: 'center',
//    flex: 1, // Each button will take up equal space
//    padding: 10, // Add some padding to the button
//    borderRadius: 5, // Optional: to give rounded corners
//    backgroundColor: '#555', // Optional: to give a button-like appearance
//  },
//  text: {
//    marginTop: 5,
//    fontSize: 14,
//    color: '#fff',
//  },
//});
//
//export default IconMenu;


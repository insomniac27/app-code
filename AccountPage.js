


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconMenu from './src/HomePage/bottom.js'; // Assuming this is your custom component
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faFileText, faExchange, faPhone, faMapMarker, faShoppingBag, faUserCircle, faCreditCardAlt, faRefresh, faSuitcase, faTruck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // Import Google icon
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


const AccountPage = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('User');

  // Function to fetch and store the user's name from Firestore
  const fetchAndStoreUserName = async (userId) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const { name } = userDoc.data(); // Assuming "name" is the field in Firestore
        await AsyncStorage.setItem('userName', name || 'User');
        setUserName(name || 'User');
      }
    } catch (error) {
      console.error('Failed to fetch user name from Firestore:', error);
    }
  };

  // Function to retrieve user's display name from AsyncStorage
  const getStoredUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      setUserName(storedName || 'User'); // Fallback to 'User' if no name is stored
    } catch (error) {
      console.error('Failed to retrieve user name from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          await fetchAndStoreUserName(currentUser.uid);
        } else {
          setUser(null);
          setUserName('User');
        }
      });

      await getStoredUserName(); // Ensure this is awaited within the async function

      return unsubscribe; // Return cleanup function
    };

    fetchUserData().catch((error) =>
      console.error('Error fetching user data:', error)
    );
  }, []);


  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      Alert.alert('Signed In', 'Welcome!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      GoogleSignin.signOut();
      setUser(null);
      setUserName('User');
      Alert.alert('Signed Out', 'You have been signed out.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Sign Out failed. Please try again.');
    }
  };

  const buttons = [
    { text: 'CREATE ACCOUNT', color: '#000', borderRadius: 0, borderColor: '#000', textColor: '#fff', textAlign: 'center', action: () => navigation.navigate('UserSignup') },
    { text: 'Already have an account? Sign in', color: '#fff', borderRadius: 0, borderColor: '#000', textColor: '#000', textAlign: 'center', action: () => navigation.navigate('UserLogin') },
    { text: 'Track Orders', color: '#fff', icon: faTruck, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => user ? navigation.navigate('Order') : Alert.alert('Sign In Required', 'Please sign in to access this feature.') },
    { text: 'Return / Exchange Order', color: '#fff', icon: faExchange, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => user ? navigation.navigate('Return') : Alert.alert('Sign In Required', 'Please sign in to access this feature.') },
    { text: 'Contact Us', color: '#fff', icon: faPhone, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Contact') },
    { text: 'Invite A Friend', color: '#fff', icon: faEnvelope, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => user ? navigation.navigate('Invite') : Alert.alert('Sign In Required', 'Please sign in to access this feature.') },
    { text: 'Payment Info', color: '#fff', icon: faCreditCardAlt, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => user ? navigation.navigate('Payment') : Alert.alert('Sign In Required', 'Please sign in to access this feature.') },
    { text: 'Terms & Conditions', color: '#fff', icon: faFileText, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Terms') },
    { text: 'Store Locator', color: '#fff', icon: faMapMarker, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Store') },
    { text: 'Privacy Policy', color: '#fff', icon: faSuitcase, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Privacy') },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {user && (
          <Text style={styles.greetingText}>Hello, {userName}</Text>
        )}
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => {
            if (user && (index === 0 || index === 1)) {
              return null;
            }
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  {
                    backgroundColor: button.color,
                    borderColor: button.borderColor,
                    marginBottom: 10,
                    marginLeft: index === 0 || index === 1 ? 20 : 0,
                    marginRight: index === 0 || index === 1 ? 20 : 0,
                    width: index === 0 || index === 1 ? '90%' : '80%',
                  },
                ]}
                onPress={button.action}
              >
                <View
                  style={[
                    styles.buttonContent,
                    {
                      justifyContent: index === 0 || index === 1 ? 'center' : 'flex-start',
                    },
                  ]}
                >
                  {button.icon && <FontAwesomeIcon icon={button.icon} style={styles.icon} />}
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: button.textColor,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {button.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {user && (
        <TouchableOpacity
          style={[
            styles.button,
            { borderRadius: 13, backgroundColor: '#000', marginTop: 20, width: '93%', marginLeft: 10, marginBottom: 30 },
          ]}
          onPress={handleSignOut}
        >
          <Text style={[styles.buttonText, { color: '#fff', textAlign: 'center', fontWeight: '500' }]}>
            Sign out
          </Text>
        </TouchableOpacity>
      )}

      <IconMenu style={styles.iconMenu} />
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 20,
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: 'end',
    justifyContent: 'center',
//    marginLeft: 10,
paddingLeft: 10,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row', // Arrange icon and text side by side
    alignItems: 'center',
  },
  buttonContent2: {
      flexDirection: 'center', // Arrange icon and text side by side
      alignItems: 'center',
    },
  buttonText: {
    fontSize: 14,
    fontWeight: 'medium',
  },
  additionalText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  iconMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  iconMenu: {
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  icon2: {
      marginRight: 10,
      marginTop: 5
    },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AccountPage;




//import React, { useState, useEffect } from 'react';
//import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
//import { useNavigation } from '@react-navigation/native';
//import IconMenu from './src/HomePage/bottom.js'; // Assuming this is your custom component
//import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
//import { faEnvelope, faFileText, faExchange, faPhone, faMapMarker, faShoppingBag, faUserCircle, faCreditCardAlt, faRefresh, faSuitcase, faTruck } from '@fortawesome/free-solid-svg-icons';
//import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // Import Google icon
//import auth from '@react-native-firebase/auth';
//import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
//
//const AccountPage = () => {
//  const navigation = useNavigation();
//  const [user, setUser] = useState(null);
//
//  const [userInfo,setUserInfo]= useState(null)
//
//  useEffect(() => {
//  GoogleSignin.configure({
//  webClientId:
//  '841829729642-5vo1cbgnrsl83sm8c8h63s7c0hf0i3mi.apps.googleusercontent.com',
//  });
//  }, []);
//
//  const signIn = async () => {
//  try {
//  await GoogleSignin.hasPlayServices();
//  const usrInfo= await GoogleSignin.signIn();
//  setUserInfo(usrInfo);
//  Alert.alert('Signed In', 'Welcome!');
//  } catch (error){
//  if(error.code == statusCodes.SIGN_IN_CANCELLED) {
//  console.log("error");
//  } else if (error.code == statusCodes.IN_PROGRESS) {
//    console.log("error");
//
//  } else if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//    console.log("error");
//
//  }else {
//    console.log("error");
//  }
//  }
//  };
//
//
//
//
//
//
//  useEffect(() => {
//    const unsubscribe = auth().onAuthStateChanged(setUser);
//    return () => unsubscribe();
//  }, []);
//
//  const handleGoogleSignIn = async () => {
//    try {
//      await GoogleSignin.hasPlayServices();
//      const { idToken } = await GoogleSignin.signIn();
//      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//      await auth().signInWithCredential(googleCredential);
//      Alert.alert('Signed In', 'Welcome!');
//    } catch (error) {
//      console.error(error);
//      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
//    }
//  };
//
//  const handleSignOut = async () => {
//    try {
//      await auth().signOut();
//      GoogleSignin.signOut();
//      setUser(null);
//      Alert.alert('Signed Out', 'You have been signed out.');
//    } catch (error) {
//      console.error(error);
//      Alert.alert('Error', 'Sign Out failed. Please try again.');
//    }
//  };
//
//  const buttons = [
//    { text: 'CREATE ACCOUNT', color: '#000', borderRadius: 0, borderColor: '#000', textColor: '#fff', textAlign: 'center', action: () => navigation.navigate('UserSignup') },
//    { text: 'Already have an account? Sign in', color: '#fff', borderRadius: 0, borderColor: '#000', textColor: '#000', textAlign: 'center', action: () => navigation.navigate('UserLogin') },
//    { text: 'Track Orders', color: '#fff', icon: faTruck, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Order') },
//    { text: 'Return / Exchange Order', color: '#fff', icon: faExchange, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Return') },
//    { text: 'Contact Us', color: '#fff', icon: faPhone, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Contact') },
//    { text: 'Invite A Friend', color: '#fff', icon: faEnvelope, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Invite') },
//    { text: 'Payment Info', color: '#fff', icon: faCreditCardAlt, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Payment') },
//    { text: 'Terms & Conditions', color: '#fff', icon: faFileText, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Terms') },
//    { text: 'Store Locator', color: '#fff', icon: faMapMarker, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Store') },
//    { text: 'Privacy Policy', color: '#fff', icon: faSuitcase, borderRadius: 0, borderColor: '#fff', textColor: '#000', textAlign: 'left', action: () => navigation.navigate('Privacy') },
//  ];
//
//  return (
//    <View style={styles.container}>
//      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//        {user && (
//          <Text style={styles.greetingText}>Hello, {user.displayName || user.email}</Text>
//        )}
//
//        <View style={styles.buttonContainer}>
//          {!user && (  // Show only if the user is not signed in
//            <>
//              {buttons.slice(0, 2).map((button, index) => (
//                <TouchableOpacity
//                  key={index}
//                  style={[styles.button, {
//                    backgroundColor: button.color,
//                    borderColor: button.borderColor,
//                    marginBottom: index === 0 ? 20 : 10, // Adds margin bottom to 1st and 2nd button
//                    width: index === 0 || index === 1 ? '95%' : '100%'
//                  }]}
//                  onPress={button.action}
//                >
//                  <Text style={[styles.buttonText, { color: button.textColor, textAlign: button.textAlign }]}>
//                    {button.text}
//                  </Text>
//                </TouchableOpacity>
//              ))}
//              <Text style={styles.additionalText}>---------- Or continue with ----------</Text>
//              <TouchableOpacity
//                style={[styles.button, { backgroundColor: '#fff', marginTop: 20, width: '93%', marginBottom: 20, borderRadius: 10 }]}
//                onPress={()=>{
//                signIn();
//                }}
//              >
//                <View style={styles.buttonContent2}>
//                  <FontAwesomeIcon icon={faGoogle} size={20} color="#4285F4" style={styles.icon2} />
//                  <Text style={[styles.buttonText, { color: '#000', textAlign: 'center', marginBottom: 3, paddingTop: 3 }]}>
//                    Sign in with Google
//                  </Text>
//                </View>
//              </TouchableOpacity>
//            </>
//          )}
//
//          {buttons.slice(2).map((button, index) => (
//            <TouchableOpacity key={index} style={[styles.button, { backgroundColor: button.color, borderColor: button.borderColor }]} onPress={button.action}>
//              <View style={styles.buttonContent}>
//                {button.icon && <FontAwesomeIcon icon={button.icon} style={styles.icon} />}
//                <Text style={[styles.buttonText, { color: button.textColor }]}>{button.text}</Text>
//              </View>
//            </TouchableOpacity>
//          ))}
//        </View>
//      </ScrollView>
//
//      <View style={styles.signOutContainer}>
//        {user && (
//          <TouchableOpacity
//            style={[styles.button, { backgroundColor: '#000', marginTop: 20, width: '93%', marginLeft: 10, marginBottom: 30, borderRadius: 20}]}
//            onPress={handleSignOut}
//          >
//            <Text style={[styles.buttonText, { color: '#fff', textAlign: 'center', fontWeight: '500' }]}>
//              Sign out
//            </Text>
//          </TouchableOpacity>
//        )}
//      </View>
//
//      <IconMenu style={styles.iconMenu} />
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    backgroundColor: '#f5f5f5',
//  },
//  scrollView: {
//    flex: 1,
//  },
//  scrollContent: {
//    paddingBottom: 80,
//  },
//  buttonContainer: {
//    flex: 1,
//    marginTop: 20,
//  },
//  signOutContainer: {
//    marginBottom: 20,
//    justifyContent: 'flex-end',
//    alignItems: 'center',
//  },
//  button: {
//    width: '100%',
//    height: 50,
//    alignItems: 'end',
//    justifyContent: 'center',
//    marginLeft: 10,
//    borderWidth: 1,
//  },
//  buttonContent: {
//    flexDirection: 'row', // Arrange icon and text side by side
//    alignItems: 'center',
//  },
//  buttonContent2: {
//    flexDirection: 'center', // Arrange icon and text side by side
//    alignItems: 'center',
//  },
//  buttonText: {
//    fontSize: 14,
//    fontWeight: 'medium',
//  },
//  additionalText: {
//    fontSize: 14,
//    color: '#888',
//    textAlign: 'center',
//    marginVertical: 10,
//  },
//  iconMenuContainer: {
//    position: 'absolute',
//    bottom: 0,
//    left: 0,
//    right: 0,
//    height: 60,
//  },
//  iconMenu: {
//    flex: 1,
//  },
//  icon: {
//    marginRight: 10,
//  },
//  icon2: {
//    marginRight: 10,
//  },
//  greetingText: {
//    fontSize: 18,
//    fontWeight: 'bold',
//    textAlign: 'center',
//    marginVertical: 20,
//  },
//});
//
//export default AccountPage;
//




//import React, { useState, useEffect } from 'react';
//import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
//import { GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
//
//const GoogleSigninScreen = () => {
//const [userInfo,setUserInfo]= useState(null)
//  const [isSigningIn, setIsSigningIn] = useState(false); // Track sign-in progress
//
//useEffect(() => {
//GoogleSignin.configure({
//webClientId:
//'841829729642-fj7mg0t8ahouca5f8mdq3hnooav1mk8r.apps.googleusercontent.com',
//});
//}, []);
//
////const signIn = async () => {
////try {
////await GoogleSignin.hasPlayServices();
////const usrInfo= await GoogleSignin.signIn();
////setUserInfo(usrInfo);
////
////} catch (error){
////if(error.code == statusCodes.SIGN_IN_CANCELLED) {
//////console.log("error")
////} else if (error.code == statusCodes.IN_PROGRESS) {
//////console.log("error")
////
////} else if (error.code == statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
////}else {
////}
////}
////};
//
//const signIn = async () => {
//    if (isSigningIn) {
//      console.log('Sign-in is already in progress.');
//      return; // Prevent multiple sign-in attempts
//    }
//
//    setIsSigningIn(true); // Mark as signing in
//
//    try {
//      await GoogleSignin.hasPlayServices();
//      const usrInfo = await GoogleSignin.signIn();
//      setUserInfo(usrInfo);
//      console.log('User Info:', usrInfo);
//    } catch (error) {
//      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//        console.log('User cancelled the login process.');
//      } else if (error.code === statusCodes.IN_PROGRESS) {
//        console.log('Sign-in is already in progress.');
//      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//        console.log('Play Services not available or outdated.');
//      } else {
//        console.log('An unknown error occurred:',error.code, error.message);
//      }
//    } finally {
//      setIsSigningIn(false); // Reset the state
//    }
//  };
//
//
//
//return (
////<View>
////{userInfo != null && <Text>{userInfo.user.name}</Text}
////{userInfo != null && <Text>{userInfo.user.email}</Text}
////{userInfo != null && <Text>{userInfo.user.name}</Text}
////
////<Text style= {{padding: 20, borderWidth: 10}}onPress={()=>{
////signIn();
////}}>signIn</Text>
////<Text>signOut</Text>
////
////</View>
////);
////};
////
////export default GoogleSigninScreen;
//
//<View style={{flex:1 ,justifyContent: 'center', alignItems: 'center'}}>
//      {userInfo != null && <Text>{userInfo.user.name}</Text>}
//      {userInfo != null && <Text>{userInfo.user.email}</Text>}
//      {userInfo != null && <Text>{userInfo.user.name}</Text>}
//
//
//{userInfo == null ? (
//   <Text
//           style={{ padding: 20, borderWidth: 10 }}
//           onPress={() => {
//             signIn();
//           }}
//         >
//           signIn
//         </Text>
//) : (
//      <Text>signOut</Text>
//
//)}
//
//    </View>
//  );
//};
//export default GoogleSigninScreen;
//




//
//import React, { useState, useEffect } from 'react';
//import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
//import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
//
//const GoogleSigninScreen = () => {
//  const [userInfo, setUserInfo] = useState(null);
//
//  useEffect(() => {
//    GoogleSignin.configure({
//      webClientId:
//        '841829729642-5vo1cbgnrsl83sm8c8h63s7c0hf0i3mi.apps.googleusercontent.com',
//    });
//  }, []);
//
//  const signIn = async () => {
//    try {
//      await GoogleSignin.hasPlayServices();
//      const usrInfo = await GoogleSignin.signIn();
//      setUserInfo(usrInfo);
//      Alert.alert('Success', 'Signed in successfully!');
//    } catch (error) {
//      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//        Alert.alert('Cancelled', 'Sign-in was cancelled.');
//      } else if (error.code === statusCodes.IN_PROGRESS) {
//        Alert.alert('In Progress', 'Sign-in is already in progress.');
//      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//        Alert.alert('Error', 'Google Play Services are not available.');
//      } else {
//        console.error(error);
//        Alert.alert('Error', 'An unknown error occurred.');
//      }
//    }
//  };
//
//  return (
//    <View style={styles.container}>
//      <TouchableOpacity style={styles.button} onPress={signIn}>
//        <Text style={styles.buttonText}>Sign In with Google</Text>
//      </TouchableOpacity>
//      <Text style={styles.userInfo}>
//        {userInfo ? `Hello, ${userInfo.user.name}` : 'Sign in to continue'}
//      </Text>
//    </View>
//  );
//};
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor: '#f5f5f5',
//  },
//  button: {
//    backgroundColor: '#4285F4',
//    padding: 15,
//    borderRadius: 5,
//  },
//  buttonText: {
//    color: '#fff',
//    fontWeight: 'bold',
//  },
//  userInfo: {
//    marginTop: 20,
//    fontSize: 16,
//    color: '#333',
//  },
//});
//
//export default GoogleSigninScreen;

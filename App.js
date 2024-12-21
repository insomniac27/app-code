

import React, { useEffect } from 'react';
import { View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './AppNavigator.js';
import Header from './src/HomePage/header.js';
import IconMenu from './src/HomePage/bottom.js';

const App = () => {
//   //Initialize Firebase notifications
//  const requestUserPermission = async () => {
//    const authStatus = await messaging().requestPermission();
//    if (
//      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//      authStatus === messaging.AuthorizationStatus.PROVISIONAL
//    ) {
//      console.log('Authorization status:', authStatus);
//    }
//  };
//
//  const getFCMToken = async () => {
//    try {
//      const token = await messaging().getToken();
//      console.log('FCM Token:', token);
//    } catch (error) {
//      console.error('Error getting FCM token:', error);
//    }
//  };
//
//  const setupNotificationListeners = () => {
//    messaging().onMessage(async (remoteMessage) => {
//      console.log('Foreground Notification:', remoteMessage);
//    });
//
//    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//      console.log('Background Notification:', remoteMessage);
//    });
//  };
//
//  useEffect(() => {
//    requestUserPermission();
//    getFCMToken();
//    setupNotificationListeners();
//  }, []);

  return (
    <View style={{ flex: 1 }}>

      <AppNavigator />

    </View>
  );
};

export default App;



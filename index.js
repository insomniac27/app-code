///**
// * @format
// */
//
//import {AppRegistry} from 'react-native';
//import App from './App';
//import {name as appName} from './app.json';
//
//AppRegistry.registerComponent(appName, () => App);
















/**
 * @format
 */

//import {AppRegistry} from 'react-native';
//import App from './App';
//import {name as appName} from './app.json';
//
//AppRegistry.registerComponent(appName, () => App);


import { AppRegistry } from 'react-native';
//import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

//// Background notification handler
//messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//  console.log('Background Notification (index.js):', remoteMessage);
//});

AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from "firebase";

var config = {
    apiKey: "AIzaSyBcTKzKhNWNmfbcng17tev7ycubCkd4o7Q",
    authDomain: "chat-test-app-edc2f.firebaseapp.com",
    databaseURL: "https://chat-test-app-edc2f-default-rtdb.firebaseio.com",
    projectId: "chat-test-app-edc2f",
    storageBucket: "chat-test-app-edc2f.appspot.com",
    messagingSenderId: "34459625408",
    appId: "1:34459625408:web:556bbd5f53fd05b9d1ca25"
};
  
if( firebase.apps.length === 0 ){
    firebase.initializeApp(config);
}

AppRegistry.registerComponent(appName, () => App);

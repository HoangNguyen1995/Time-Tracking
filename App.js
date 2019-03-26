import Loading from './components/Loading';
import Authentication from './components/Authentication';
import Main from './components/Main';

import firebase from 'firebase';

import React from 'react'
import { StyleSheet } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

const AppStack = createStackNavigator({ Home: Main});
const AuthStack = createStackNavigator({ Authentication: Authentication });

const App = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: Loading,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
export default App

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  timeListContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  },
  title:{
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerList:{
    paddingBottom:15,
  },
});

import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import EditableTimer from './EditableTimer';
import ToggleableTimerForm from './ToggleableTimerForm';
import uuidv4 from 'uuid/v4'
import {newTimer} from '../utils/TimerUtils'

import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBYjKU5UXJhRJWui2gI9PIxXp9_BIUPCWo",
    authDomain: "time-tracking-24146.firebaseapp.com",
    databaseURL: "https://time-tracking-24146.firebaseio.com",
    projectId: "time-tracking-24146",
    storageBucket: "time-tracking-24146.appspot.com",
    messagingSenderId: "742211123709"
  };

if (!firebase.apps.length){
  firebase.initializeApp(config);
}



export default class Main extends React.Component {


  static navigationOptions = ({navigation}) => {
    return {
      title: 'Timer',
      headerRight: (
        <TouchableOpacity style={styles.signOut} onPress={navigation.getParam('signOut')}>
          <Text style={styles.textSignOut}>Sign Out</Text>
        </TouchableOpacity>
      ),
    }
  };

  state = {
    timers : [],
    path : ''
  }


  handleSignOut = async () => {
    try {
        await firebase.auth().signOut();
    } catch (e) {
        console.log(e);
    }
}

  handleCreateFormSubmit = timer => {
    const {timers} = this.state;
    const added = newTimer(timer);
    firebase.database().ref(this.state.path).push(added).then((data)=>{
            console.log('data ' , data)
        }).catch((error)=>{
            console.log('error ' , error)
        })
  };

  handleFormSubmit = attrs =>{
    const { timers} = this.state;

    timers.forEach(timer => {
      if (timer.id === attrs.id){
        const {title , project} = attrs;
        firebase.database().ref(this.state.path + timer.id + '/').update({
          title,project,
        })
      }
    })
  };

  handleFormRemove = timerId => {
    firebase.database().ref(this.state.path + timerId).remove();
  };

  toggleTimer = timerId => {

    const { timers } = this.state;

    timers.forEach(timer => {
      const { id, isRunning } = timer;
      if (id === timerId) {
        firebase.database().ref(this.state.path + timerId + '/').update({
          isRunning: !isRunning
        })
      }
    })
  }


  componentDidMount(){
    this.props.navigation.setParams({ signOut: this.handleSignOut });

    const { path } = this.state;
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (!user) {
        this.props.navigation.navigate('SignUp');
      }else{
        const path = 'time-items/' + user.uid + '/';
        console.log('path: ', path);
        this.setState({path}, function() {
          console.log('WTF: ', this.state.path);
          firebase.database().ref(this.state.path).on('value', (snapshot) => {
            const arr = [];
            snapshot.forEach(item => {
              const itemVal = item.val();
              arr.push({...itemVal, id: item.key});
            })
            console.log(arr);
            this.setState({ timers: arr })
          })
        })
      }
    })


    const TIME_INTERVAL = 1000;

    this.intervalId = setInterval(() => {
      const { timers } = this.state;

      timers.forEach(timer =>{
        const { elapsed, isRunning , id} = timer;

        firebase.database().ref(this.state.path + id + '/').update({
          elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed,
        })
      })
    }, TIME_INTERVAL);
  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  render() {
    const { timers } = this.state;
    return (
      <View style={styles.appContainer}>

        <KeyboardAvoidingView
          style={styles.timeListContainer}
          behavior='padding'
        >
          <ScrollView style={styles.timerList}>
            <ToggleableTimerForm
              onFormSubmit={this.handleCreateFormSubmit}
            />
            {timers.map(
              ({title, project, id, elapsed, isRunning}) => (
                  <EditableTimer
                    key={id}
                    id={id}
                    title={title}
                    project={project}
                    elapsed={elapsed}
                    isRunning={isRunning}
                    onFormSubmit={this.handleFormSubmit}
                    onFormRemove={this.handleFormRemove}
                    onStartPress={this.toggleTimer}
                    onStopPress={this.toggleTimer}
                    />
                  ),
              )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

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
  signOut: {
    paddingRight: 12
  },
  textSignOut: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

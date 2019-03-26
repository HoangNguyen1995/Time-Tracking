import React from 'react';
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import TimerButton from './TimerButton';

export default class Authentication extends React.Component {
  static navigationOptions = {
    title: 'Authentication',
  };
  state = { email: '', password: '', errorMessage: null }

  handleSignUp = () => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate('Home'))
        .catch(error => {
          console.log(error.message);
          this.setState({ errorMessage: error.message })
        })
  }

  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  render() {
      return (
          <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
          >
            {this.state.errorMessage &&
              <Text style={styles.errorMessage}>
                {this.state.errorMessage}
              </Text>}

              <View style={styles.formContainer}>
                <View style={styles.attributteContainer}>
                  <Text style={styles.textInputTitle}>Email</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      autoCapitalize="none"
                      style={styles.textInput}
                      onChangeText={email => this.setState({ email })}
                      value={this.state.email}
                    />
                  </View>
                </View>
                <View style={styles.attributteContainer}>
                  <Text style={styles.textInputTitle}>Password</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      secureTextEntry
                      autoCapitalize="none"
                      style={styles.textInput}
                      onChangeText={password => this.setState({ password })}
                      value={this.state.password}
                    />
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TimerButton
                  color="blue"
                  title="Sign Up"
                  small="false"
                  onPress={this.handleSignUp}
                  />
                  <TimerButton
                  color="blue"
                  title="Login"
                  small="true"
                  onPress={this.handleLogin}
                  />
                </View>
              </View>

          </KeyboardAvoidingView>
      )
  }
}
const styles = StyleSheet.create({

  formContainer:{
    backgroundColor: 'white',
    borderColor: '#D6D7DA',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 80,
  },
  attributteContainer:{
    marginVertical: 8,
  },
  textInputContainer:{
    borderColor: '#D6D7DA',
    borderRadius: 2,
    borderWidth:1,
    marginBottom: 5
  },
  textInput:{
    height:30,
    padding: 5,
    fontSize: 12,
  },
  textInputTitle:{
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '90%'
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    padding: 10
  }
})

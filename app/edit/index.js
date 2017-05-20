import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Edit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello I'm Edit</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
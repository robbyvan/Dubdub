import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

let width = Dimensions.get('window').width;

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  render() {
    let user = this.state.user;

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>关于我</Text>
        </View>

        
          <View style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>更换头像</Text>
              <TouchableOpacity style={styles.avatarBox}>
                <Icon 
                  name='ios-add'
                  style={styles.plusIcon}
                  />
              </TouchableOpacity>
          </View>
        
        

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666'
  },
  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTip: {
    color:'#fff'
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#999',
    fontSize: 30,
    backgroundColor: '#fff',
    borderRadius: 8
  }


});
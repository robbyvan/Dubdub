import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';

import List from './app/creation/index'
import Edit from './app/edit/index'
import Account from './app/account/index'
import Login from './app/account/login'

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  AsyncStorage
} from 'react-native'; 

import {
  Navigator
} from 'react-native-deprecated-custom-components';


export default class Dubdub extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      selectedTab: 'list',
      logined: false
    };
  }

  componentDidMount() {
    this._asyncAppStatus();
  }

  _asyncAppStatus() {
    let that = this;

    AsyncStorage.getItem('user')
      .then((data) => {
        let user;
        let newState = {};

        if (data) {
          user = JSON.parse(data);
        }

        if (user && user.accessToken) {
          newState.user = user;
          newState.logined = true;
        }else {
          newState.logined = false;
        }

        that.setState(newState);
      });
  }

  _afterLogin(user) {
    let that = this;

    user = JSON.stringify(user);
    AsyncStorage.setItem('user', user)
      .then(() => {
        that.setState({
          logined: true,
          user: user
        });
      });
  }

  _logout() {
    AsyncStorage.removeItem('user');
    this.setState({
      logined: false,
      user: null
    });
  }

  render() {
    if (!this.state.user) {
      return (
        <Login afterLogin={this._afterLogin.bind(this)}/>
      );
    }
    return (
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItem
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam-outline'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <Navigator
            initialRoute={{
              name: 'list',
              component: List
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight;
            }}
            renderScene={(route, navigator) => {
              let Comp = route.component;
              return <Comp {...route.params} navigator={navigator} 
                />
            }} />
        </Icon.TabBarItem>

        <Icon.TabBarItem
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit />
        </Icon.TabBarItem>

        <Icon.TabBarItem
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          <Account 
            user={this.state.user}
            logout={this._logout.bind(this)} />
        </Icon.TabBarItem>

      </TabBarIOS>
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

AppRegistry.registerComponent('Dubdub', () => Dubdub);

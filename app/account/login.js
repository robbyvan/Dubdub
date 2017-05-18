import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS
} from 'react-native';

var Button = require('react-native-button').default;

var request = require('./../common/request');
var config = require('./../common/config');

export default class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      codeSent: false,
      phoneNumber: '',
      verifyCode: ''
    };
  }

  _submit() {

  }

  _showVerifyCode() {
    this.setState({
      codeSent: true
    });
  }

  _sendVerifyCode(){

    let that = this;
    let phoneNumber = this.state.phoneNumber;

    if (!phoneNumber){
      return AlertIOS.alert('手机号不能为空');
    }

    let body = {
      phoneNumber: phoneNumber
    };

    let url = config.api.base + config.api.signup;
    console.log(url);
    
    request.post(url, body)
      .then((data) => {
        if (data && data.success){
          that._showVerifyCode();
        }else {
          console.log(data);
          AlertIOS.alert('获取失败, 请检查手机号');
        }
      })
      .catch((err) => {
        throw err;
        AlertIOS.alert('获取失败, 请检查当前网络状况')
      })


  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder='输入手机号'
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
            />

            {
              this.state.codeSent
              ? <View style={styles.verifyCodeBox}>
                  <TextInput
                    placeholder='输入验证码'
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={'number-pad'}
                    style={styles.inputField}
                    onChangeText={(text) => {
                      this.setState({
                        verifyCode: text
                      })
                    }}
                    />
                </View>
              :null
            }

            {
              this.state.codeSent
              ? <Button
                  style={styles.btn}
                  onPress={this._submit.bind(this)}>登录</Button>
              :<Button
                  style={styles.btn}
                  onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
            }

        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  signupBox: {
    marginTop: 30
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },
  inputField: {
    padding: 5,
    height: 40,
    backgroundColor: '#fff',
    color: '#666',
    fontSize: 16,
    borderRadius: 4
  },
  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderRadius: 4,
    borderWidth: 1,
    color: '#ee735c'

  }
});
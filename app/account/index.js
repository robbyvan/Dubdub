import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage
} from 'react-native';

var ImagePicker = require('react-native-image-picker');
var photoOptions = {
  title: '选择头像',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照上传',
  chooseFromLibraryButtonTitle: '从相册上传',
  quality: 0.75,
  allowsEditing: true,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

let width = Dimensions.get('window').width;

export default class Account extends Component {
  constructor(props) {
    super(props);
    let user = this.props.user || {}
    this.state = {
      user: user
    };
  }

  componentDidMount() {
    let that = this;

    AsyncStorage.getItem('user')
      .then((data) => {
        console.log(data);
        let user;
        if (data) {
          user = JSON.parse(data);
        }
        if (user && user.accessToken) {
          that.setState({
            user: user
          });
        }
      })
  }

  _pickPhoto() {
    let that = this;

    console.log('what');

    ImagePicker.showImagePicker(photoOptions, (response) => {
      if (response.didCancel) {
        return;
      }

      let avatarData = 'data:image/jpeg;base64,' + response.data;
      let user = this.state.user;

      user.avatar = avatarData;

      that.setState({
        user: user
      });
    });
  }

  render() {
    let user = this.state.user;

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>关于我</Text>
        </View>

        {
          user.avatar
          ?<TouchableOpacity 
              style={styles.avatarContainer}
              onPress={this._pickPhoto.bind(this)}
              >
                <Image 
                  style={styles.avatarContainer} 
                  source={{uri: user.avatar}}>
                  <View style={styles.avatarBox}>
                    <Image 
                      source={{uri: user.avatar}}
                      style={styles.avatar}
                      />
                  </View>
                  <Text style={styles.avatarTip}>更换头像</Text>
                </Image>
            </TouchableOpacity>
        :
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={this._pickPhoto.bind(this)}
          >
              <Text style={styles.avatarTip}>添加头像</Text>
              <View style={styles.avatarBox}>
                <Icon 
                  name='ios-add'
                  style={styles.plusIcon}
                  />
              </View>
          </TouchableOpacity>
        }
          
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
    backgroundColor: '#666',
  },
  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  avatarTip: {
    color:'#fff',
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 15,
    resizeMode: 'cover',
    borderRadius: width * 0.1,
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#999',
    fontSize: 24,
    backgroundColor: '#fff',
    borderRadius: 8
  }


});
import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage,
  AlertIOS,
  Modal,
  TextInput
} from 'react-native';
import * as Progress from 'react-native-progress';

var sha1 = require('sha1');
var request = require('./../common/request');
var config = require('./../common/config');

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

const CLOUDINARY = {
  cloud_name: 'dnsavc5be',  
  api_key: '925995529743554',  
  api_secret: 'r_pa57uynf1Q0T92L6thDpaIznA',  
  base:  'http://res.cloudinary.com/dnsavc5be',
  image: 'https://api.cloudinary.com/v1_1/dnsavc5be/image/upload',
  video: 'https://api.cloudinary.com/v1_1/dnsavc5be/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/dnsavc5be/raw/upload'
};

let width = Dimensions.get('window').width;

function avatarSource(id, type) {

  if (id.indexOf('http') !== -1) {
    return id;
  }

  if (id.indexOf('data:image') !== -1) {
    return id
  }

  return CLOUDINARY.base + '/' + type + '/upload/' + id;
}

export default class Account extends Component {
  constructor(props) {
    super(props);
    let user = this.props.user || {}
    this.state = {
      user: user,
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false
    };
    this._changeUserState = this._changeUserState.bind(this);
  }

  componentDidMount() {
    let that = this;

    AsyncStorage.getItem('user')
      .then((data) => {
        // console.log(data);
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

  _edit() {
    this.setState({
      modalVisible: true
    });
  }

  _closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  _pickPhoto() {
    let that = this;

    ImagePicker.showImagePicker(photoOptions, (response) => {
      if (response.didCancel) {
        return;
      }

      let avatarData = 'data:image/jpeg;base64,' + response.data;

      let timestamp = Date.now();
      let tags = 'app,avatar';
      let folder = 'avatar';
      let signatureURL = config.api.base + config.api.signature;
      let accessToken = this.state.user.accessToken;

      request.post(signatureURL, {
        accessToken: accessToken,
        folder: folder,
        tags: tags,
        timestamp: timestamp,
        type: 'avatar'
      })
      .catch((err) => {
        console.log(err);
      })
      .then((data) => {
        console.log('data', data);
        if (data && data.success) {
          let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret;
          signature = sha1(signature);

          let body = new FormData();

          body.append('folder', folder);
          body.append('signature', signature);
          body.append('tags', tags);
          body.append('timestamp', timestamp);
          body.append('api_key', CLOUDINARY.api_key);
          body.append('resource_type', 'image');
          body.append('file', avatarData);

          that._upload(body);

        }
      })

    });
  }

  _upload(body) {

    let that = this;

    let xhr = new XMLHttpRequest();
    let url = CLOUDINARY.image;


    this.setState({
      avatarUploading: true,
      avatarProgress: 0
    })

    xhr.open('POST', url);

    console.log('new xhr', xhr);

    xhr.onload = () => {
      console.log('onload here');
      if (xhr.status !== 200) {
        AlertIOS.alert('请求失败了');
        console.log(xhr.responseText);
        return;
      }

      if (!xhr.responseText) {
        AlertIOS.alert('请求失败了');
        console.log(xhr.responseText);
        return;
      }

      let response;//返回的纯文本
      console.log('response', response);
      try {
        response = JSON.parse(xhr.response)
      }catch(e) {
        console.log(e);
        console.log('parse failed');
      }

      if (response && response.public_id) {
        let user = this.state.user;
        user.avatar = response.public_id;

        that.setState({
          user: user,
          avatarUploading: false,
          avatarProgress: 0,
        });

        that._asyncUser(true);

      }
    }

    xhr.onerror = (err) => {
      console.log('on error', err);
    }

    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(2));
          that.setState({
            avatarProgress: percent
          });
        };
      }
    }

    xhr.send(body);
  }

  _asyncUser(isAvatar){
    let that = this;
    let user = this.state.user;

    if (user && user.accessToken) {
      let url = config.api.base + config.api.update;

      request.post(url, user)
        .then((data) => {
          if (data && data.success) {
            let user = data.data;

            if (isAvatar){
              AlertIOS.alert('头像更新成功');
            }

            that.setState({
              user: user
            }, function() {
              AsyncStorage.setItem('user', JSON.stringify(user));
            });

          }
        })

    }
  }

  _changeUserState(key, val) {
    let user = this.state.user;

    user[key] = val;

    this.setState({
      user: user
    });
  }

  render() {
    let user = this.state.user;

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>关于我</Text>
          <Text 
            style={styles.toolbarEdit}
            onPress={this._edit.bind(this)}
            >编辑</Text>
        </View>

        {
          user.avatar
          ?<TouchableOpacity 
              style={styles.avatarContainer}
              onPress={this._pickPhoto.bind(this)}
              >
                <Image 
                  style={styles.avatarContainer} 
                  source={{uri: avatarSource(user.avatar, 'image')}}>
                  <View style={styles.avatarBox}>
                    {
                      this.state.avatarUploading
                      ?<Progress.Circle 
                          size={30} 
                          showsText={true}
                          color={'#ee735c'}
                          size={75}
                          progress={this.state.avatarProgress}
                          />
                      :<Image 
                          source={{uri: avatarSource(user.avatar, 'image')}}
                          style={styles.avatar}
                          />
                    }
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
                {
                  this.state.avatarUploading
                  ?<Progress.Circle 
                      size={30} 
                      showsText={true}
                      color={'#ee735c'}
                      size={75}
                      progress={this.state.avatarProgress}
                      />
                  :<Icon 
                    name='ios-add'
                    style={styles.plusIcon}
                    />
                }
              </View>
          </TouchableOpacity>
        }

        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}
          >
          <View style={styles.modalContainer}>
            <Icon 
              name='ios-close-outline'
              style={styles.closeIcon}
              onPress={this._closeModal.bind(this)}
              />
              <View style={styles.fieldItem}>
                <Text style={styles.label}>昵称</Text>
                <TextInput 
                  placeholder={'输入你的昵称'}
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.nickname}
                  onChangeText={(text) => {
                    this._changeUserState('nickname', text)
                  }}
                  />
              </View>

              <View style={styles.fieldItem}>
                <Text style={styles.label}>年龄</Text>
                <TextInput 
                  style={styles.inputField}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  defaultValue={user.age}
                  onChangeText={(text) => {
                    this._changeUserState('age', text)
                  }}
                  />
              </View>

              <View style={styles.fieldItem}>
                <Text style={styles.label}>性别</Text>
                <Icon.Button 
                  style={[styles.gender, user.gender === 'male' && styles.genderChecked]}
                  name='ios-nutrition'
                  onPress={(text) => {
                    this._changeUserState('gender', 'male')
                  }}
                  >男</Icon.Button>
                <Icon.Button 
                  style={[styles.gender, user.gender === 'female' && styles.genderChecked]}
                  name='ios-nutrition-outline'
                  onPress={(text) => {
                    this._changeUserState('gender', 'female')
                  }}
                >女</Icon.Button>
              </View>

              
          </View>
          
        </Modal>
          
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
  },
  toolbarEdit: {
    position: 'absolute',
    right: 10,
    top: 26,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  label: {
    color: '#ccc',
    marginRight: 10
  },
  inputField: {
    flex: 1,
    height: 50,
    color: '#666',
    fontSize: 14
  },
  closeIcon: {
    position: 'absolute',
    fontSize: 32,
    width: 40,
    height: 40,
    color: '#ee735c',
    top: 30,
    right: 20
  },
  gender: {
    backgroundColor: '#ccc'
  },
  genderChecked: {
    backgroundColor: '#ee735c'
  }


});
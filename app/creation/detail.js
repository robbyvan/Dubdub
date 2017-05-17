import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import Video from 'react-native-video';

let width = Dimensions.get('window').width;

export default class Detail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false
    };
  }

  _backToList() {
    this.props.navigator.pop();
  }

  render() {
    let data = this.props.data;
    console.log(data);

    return (
      <View style={styles.container}>
        <Text onPress={() => this._backToList()}>详情页面{data._id}</Text>
        <View style={styles.videoBox}>
          <Video 
            ref='videoPlayer'
            source={{uri: data.video}}
            style={styles.video}
            volumn={3}
            pause={false}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={false}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}//播放进度
            onEnd={this._onEnd}
            onError={this._onError}
            />
        </View>
      </View>
    );
  }

  _onLoadStart(){
    console.log('start');
  }

  _onLoad(){
    console.log('load');
  }

  _onProgress(data){
    console.log('progress');
    console.log(data);
  }

  _onEnd(){
    console.log('start');
  }

  _onError(err){
    console.log('error', err);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  videoBox: {
    width: width,
    height: 360,
    backgroundColor: '#F5FCFF'
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: '#000'
  },
});
import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import Video from 'react-native-video';

let width = Dimensions.get('window').width;

export default class Detail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,

      playing: false,
      videoLoaded: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false

    };
  }

  _backToList() {
    this.props.navigator.pop();
  }

  _replay() {
    this.refs.videoPlayer.seek(0);
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
            onLoadStart={this._onLoadStart.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}//播放进度
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)}
          />
          {
              !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loadingVideo} />
          }

          {
              this.state.videoLoaded && !this.state.playing ? 
                <Icon onPress={this._replay.bind(this)} 
                      name='ios-play'
                      size={48}
                      style={styles.playIcon}
                      />
              : null
          }

          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
          </View>

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

    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded: true
      });
    }
  
    let duration = data.playableDuration;
    let currentTime = Number(data.currentTime.toFixed(2));
    let percent = Number((currentTime / duration).toFixed(2));

    let newState = {
      videoTotal: duration,
      currentTime: currentTime,
      videoProgress: percent
    };

    if (!this.state.videoLoaded) {
      newState.videoLoaded = true;
    }
    if (!this.state.playing) {
      newState.playing = true;
    }
    this.setState(newState);

    console.log('progress');
    console.log(data);
  }

  _onEnd(){
    console.log('end');
    this.setState({
      videoProgress: 1,
      playing: false
    });
  }

  _onError(err){
    console.log('error', err);
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
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
  loadingVideo: {
    position: 'absolute',
    left: 0,
    top: 140,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },
  playIcon: {
    position: 'absolute',
    top: 140,
    bottom: 14,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  }
});
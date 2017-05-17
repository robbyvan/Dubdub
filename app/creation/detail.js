import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import Video from 'react-native-video';

let width = Dimensions.get('window').width;

export default class Detail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,

      videoLoaded: false,
      playing: false,
      paused: false,

      videoOk: true,
      
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false

    };
  }

  _pop() {
    this.props.navigator.pop();
  }

  _replay() {
    this.refs.videoPlayer.seek(0);
  }

  _pause() {
    console.log('PPPPPPPPAAAAAUUUUUUSSSSSEE!!!!!!!');
    if (!this.state.paused){
      this.setState({
        paused: true
      });  
    }
  }

  _resume() {
    if (this.state.paused){
      this.setState({
        paused: false
      });  
    }
    
  }

  render() {
    let data = this.props.data;
    console.log(data);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBox}
            onPress={this._pop.bind(this)}
            >
            <Icon name='ios-arrow-back'
                  style={styles.backIcon} 
                  />
            <Text style={styles.backText}>返回</Text>
            </TouchableOpacity>
          <Text style={styles.headerTitle}
                numberOfLines={1}>视频详情页</Text>
        </View>
        
        <View style={styles.videoBox}>
          <Video 
            ref='videoPlayer'
            source={{uri: data.video + '12211'}}
            style={styles.video}
            volumn={3}
            paused={this.state.paused}
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
            !this.state.videoOk && <Text style={styles.failText}>啊哟, 视频出错了</Text>
          }


          {
            // 加载中图标
              !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loadingVideo} />
          }

          {
            // 重播按钮
              this.state.videoLoaded && !this.state.playing ? 
                <Icon onPress={this._replay.bind(this)} 
                      name='ios-refresh'
                      size={48}
                      style={styles.playIcon}
                      />
              : null
          }

          {
            // 暂停播放按钮
            this.state.videoLoaded && this.state.playing ?
              <TouchableOpacity onPress={this._pause.bind(this)} 
                                style={styles.pauseBtn}
                                >
                {
                  this.state.paused?
                  <Icon onPress={this._resume.bind(this)}
                        name='ios-play'
                        size={48}
                        style={styles.resumeIcon} 
                        />
                  :null
                }
              </TouchableOpacity>
              :null
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
    this.setState({
      videoOk: false
    });
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,1)',
    backgroundColor: '#fff'
  },
  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center' 
  },
  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5
  },
  backText: {
    color: '#999'
  },
  headerTitle: {
    width: width - 120,
    textAlign: 'center'
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
  },
  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: 360
  },
  resumeIcon: {
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
  },
  failText: {
    position: 'absolute',
    left: 0,
    top: 180,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  }
});
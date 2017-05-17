import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  ListView
} from 'react-native';

import Video from 'react-native-video';
var request = require('./../common/request');
var config = require('./../common/config');

let width = Dimensions.get('window').width;

export default class Detail extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      data: this.props.data,
      dataSource: ds.cloneWithRows([]),

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
    // console.log('PPPPPPPPAAAAAUUUUUUSSSSSEE!!!!!!!');
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

  componentDidMount() {
    //装载后再请求视频
    // console.log('Did Mount Video');
    this._fetchData();
  }

  _fetchData() {
    // console.log('gonnnnna fetch');
    let that = this;
    let url = config.api.base + config.api.comments;

    request.get(url, {
      creation: 124,
      accessToken: '123a'
    })
    .then((data) => {
      // console.log('got comments');
      // console.log(data);
      if (data && data.success){
        let comments = data.data;
        

        if (comments && comments.length > 0){
          that.setState({
            comments: comments,
            dataSource: that.state.dataSource.cloneWithRows(comments)
          });
        }

      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  _renderRow(row) {

    return (
      <View
        key={row._id}
        style={styles.replyBox}
        >
        <Image 
              style={styles.replyAvatar} 
              source={{uri: row.replyBy.avatar}} 
              />
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  }

  render() {
    let data = this.props.data;
    // console.log(data);

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

        <ScrollView
          showsVerticalScrollIndicator={false}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}>
          <View style={styles.infoBox}>
            <Image 
              style={styles.avatar} 
              source={{uri: data.author.avatar}} 
              />
              <View style={styles.descBox}>
                <Text style={styles.nickname}>{data.author.nickname}</Text>
                <Text style={styles.title}>{data.title}</Text>
              </View>
          </View>

          <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          showsVerticalScrollIndicator={false}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
        />

        </ScrollView>

      </View>
    );
  }

  _onLoadStart(){
    // console.log('start');
  }

  _onLoad(){
    // console.log('load');
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

    // console.log('progress');
    // console.log(data);
  }

  _onEnd(){
    // console.log('end');
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
    height: width * 0.56,
    backgroundColor: '#F5FCFF'
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  loadingVideo: {
    position: 'absolute',
    left: 0,
    top: 80,
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
    top: 90,
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
    top: 80,
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
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },
  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replyNickname: {
    color: '#666'
  },
  replyContent: {
    marginTop: 4,
    color: '#666'
  },
  reply: {
    flex: 1
  }
});
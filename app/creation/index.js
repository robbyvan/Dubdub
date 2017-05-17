import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native';

var request = require('./../common/request');
var config = require('./../common/config');
import Detail from './detail.js'

let width = Dimensions.get('window').width;

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
};

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      up: this.props.row.voted
    };
  }

  _up() {
    console.log('pressed Like');
    let up = !this.state.up;
    let row = this.props.row;

    let url = config.api.base + config.api.up;
    let body = {
      id: row._id,
      up: up? 'yes': 'no',
      accessToken: 'abcde'
    };

    request.post(url, body)
      .then((data) => {
        if (data && data.success) {
          this.setState({
            up: up
          });
        } else {
          AlertIOS.alert('操作失败了, 稍后再试试吧');
        }
      })
      .catch((err)  => {
        console.log(err);
        AlertIOS.alert('操作失败了, 稍后再试试吧')
      });
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>

          <Text style={styles.title}>{this.props.row.title}</Text>

          <Image
            source={{uri: this.props.row.thumb}}
            style={styles.thumb}
            >
            <Icon
              name='ios-play'
              size={28}
              style={styles.play} />
          </Image>

          <View style={styles.itemFooter}>

            <View style={styles.handleBox}>
              <Icon
              name={this.state.up? 'ios-heart': 'ios-heart-outline'}
              size={28}
              style={[styles.up, this.state.up? null: styles.down]} 
              onPress={this._up.bind(this)}
              />
              <Text style={styles.handleText}>喜欢</Text>
            </View>

            <View style={styles.handleBox}>
              <Icon
              name='ios-chatboxes-outline'
              size={28}
              style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>

          </View>

        </View>
      </TouchableHighlight>
    )
  }
}


export default class List extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false,
      isRefreshing: false
    };
  }

  componentDidMount() {
    this._fetchData(1);
  }

  _fetchData(page) {

    var that = this;

    if (page !== 0) {
      //是下滑浏览
      this.setState({
        isLoadingTail: true
      });
    }else {
      //是上拉刷新
      this.setState({
        isRefreshing: true
      });
    }


    //请求数据
    request.get(config.api.base + config.api.creations, {
      accessToken: 'adc',
      page: page
    })
      .then((data) => {
        // console.log('data', data);
        if (data.success){
          // console.log(data);
          let items = cachedResults.items.slice(0);

          if (page !== 0) {
            //如果是下滑浏览更多, 把请求数据放在本地后面
            items = items.concat(data.data);  
            cachedResults.nextPage += 1;
          }else {
            //如果是下拉刷新,把本地放在请求数据之后重渲染
            items = data.data.concat(items);
          }

          cachedResults.items = items;
          cachedResults.total = data.total;

          setTimeout(() => {
            if (page !== 0) {
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(
                  cachedResults.items)
              })
            }else {
              that.setState({
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(
                  cachedResults.items)
              });
            }
          }, 20);
        }
      })
      .catch((error) => {
        if (page !== 0) {
          this.setState({
            isLoadingTail: false
          })
        }else {
          this.setState({
            isRefreshing: false
          })
        }
        console.error(error);
      });
  }

  _hasMore() {
    // console.log('hasmore?');
    console.log(cachedResults.items.length, cachedResults.total);
    return cachedResults.items.length !== cachedResults.total;
  }

  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return;
    }

    this._fetchData(0);
  }

  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return;
    }

    let page = cachedResults.nextPage;

    console.log(this.state);

    this._fetchData(page);
  }

  _renderFooter() {
    if (!this._hasMore() && cachedResults.total !== 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }

    if (!this.state.isLoadingTail) {
      return <View style={styles.loadingMore} />
    }

    return  <ActivityIndicator style={styles.loadingMore} />
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          onEndReachedThreshold={20}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor='#ff6600'
              title='努力加载中...'
            />
          }
          showsVerticalScrollIndicator={false}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }

  _loadPage(row) {
    this.props.navigator.push({
      name: 'detail',
      component: Detail,
      params: {
        data: row
      }
    });
  }

  _renderRow(row) {
    //row 是dataSource数组里面的对象
    return <Item 
      key={row._id}
      row={row} 
      onSelect={() => this._loadPage(row)}
      />
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: '#ed7b66'
  },
  down: {
    fontSize: 22,
    color: '#333'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333'
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});
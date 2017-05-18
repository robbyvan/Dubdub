APP(2)
  TabBarIOS 
  ionicons.com  Vector Icons第三方模块 链接

后台与Mock
  rap.taobao.org
  mockjs

挖坑
  RN的Dimensions获取宽度

异步请求的封装
  queryString + lodash => GET(params) POST(body)拼接
  common + config

列表页上滑预加载和下拉刷新效果
  设置cachedResults存放当前已经显示的items和total
  ActivityIndicator 加载图
  showsVerticalScrollIndicator={false}
  RefreshControl

iOS屏幕尺寸与分辨率
  [iPhone6]
  英寸 4.7 inch, 2.64 x 5.44 (1 inch = 2.54 cm)
  点 375 x 667(逻辑分辨率)
  像素 750x1334(设备分辨率)
  设备像素比 2
  PPI (pixel per inch) 326
  
  [6P]
  视网膜技术 缩放

页表列点赞功能
  renderRow封装成类, 自带状态up, 通过onPress触发修改状态up
  配置了新的接口/api/up
  根据不同的状态显示不同样式

导航器 Navigator
  import {
    Navigator
  } from 'react-native-deprecated-custom-components';
  
  入口文件配置初始route
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
    通过this.props.navigator
    的push({
        name: 'detail',
        component: Detail,
        params: {
          row: row
        }
    })和
  pop()更新视图

详情页视频播放控制
  播放组件 react-native-video
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

播放控制-进度条/重播
  onEnd无法触发解决: https://github.com/react-native-community/react-native-video/issues/545

暂停/重播按钮
  this.state.paused控制video paued的props

容错处理
 视频出错

详情页视频信息补全
  添加作者信息(头像,昵称)

获取评论列表
  新建接口
  创建ListView装评论, dataSource + _renderRow

  下拉加载 -> 参见列表页

RN里提交评论表单
  onFocus -> Modal


====

登录注册接口
  rap
实现注册登录页面

本地管理应用登录状态
  AsyncStorage保存登录状态, 入口根据logined状态渲染不同的页面
  
头像展示与相册选取
  根据账户信息渲染头像



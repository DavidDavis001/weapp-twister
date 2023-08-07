// 获取全局应用程序实例对象
const app = getApp()
import dataProvider from '../../service/dataProvider'
import { imgBaseURI } from '../../utils/const';

// 创建页面实例对象
Page({
    /**
     * 页面的初始数据
     */
  data: {
    userInfo: {
      wechat: '',
      nickName: '脑筋急转弯经典爆笑',
      describe: '',
      avatarUrl: `${imgBaseURI}/twister.jpg`
    },
    shares: dataProvider.shares,
    appList: [
      {
        icon: `${imgBaseURI}/riddle.png`,
        text: '猜谜语',
        url: '../riddle/index'
      }, {
        icon: `${imgBaseURI}/duilian.png`,
        text: '精选对联',
        appId: 'wx34923941948441e2',
        path: 'pages/list/index',
      }, {
        icon: `${imgBaseURI}/xiehouyu.png`,
        text: '爆笑歇后语',
        appId: 'wx5e8c98dc5b9ea8df',
        path: 'pages/index/index',
      }, {
        icon: `${imgBaseURI}/lantern-red.png`,
        text: '猜灯谜',
        appId: 'wx4d1bb5a2ff512c47',
        path: 'pages/index/index',
      }, {
        icon: `${imgBaseURI}/tools.png`,
        text: '最强工具人',
        appId: 'wx684e5da21e3a9366',
        path: 'pages/home/index',
      }, {
        icon: `${imgBaseURI}/life-tip.png`,
        text: '生活小妙招',
        appId: 'wx8fe3f7c2c7e3366e',
        path: 'pages/list/index',
      }
    ]
  },
  onShareAppMessage: function () {
      const share = this.data.shares[Math.floor(Math.random() * this.data.imageUrls.length)];
      return {
          title: '这么火的游戏，一起玩儿啊！',
          // desc: '这么火的游戏，一起玩儿啊！',
          path: '/pages/index/index',
          imageUrl: share.imageUrl
      }
  },
  itemTap: function (e) {
    let dataSet = e.currentTarget.dataset;
    let index = dataSet.index;
    const dataList = this.data.appList || [];
    const item = dataList[index];
    if(!item.appId) {
      wx.navigateTo({
        url: "../riddle/index"
      });
    }else {
      wx.navigateToMiniProgram({
        appId: item.appId,
        path: item.path,
        // extraData: {
        //   foo: 'bar'
        // },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    }
  }
})

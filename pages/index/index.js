import dataProvider from '../../service/dataProvider'

Page({
    data: {
      shares: dataProvider.shares,
    },
    onLoad(opt) {
      // wx.setNavigationBarTitle({
      //   title: '脑筋急转弯'
      // })
    },
    onShareAppMessage: function () {
      let share = this.data.shares[Math.floor(Math.random() * this.data.shares.length)];
      return {
        title: '智力不够，就不要来挑战这个游戏了！',
        path: '/pages/index/index',
        imageUrl: share.imageUrl,
      }
    },
    start: function (e) {
      // 跳转
      wx.navigateTo({
        url: "../twister/index"
      });
    },
    more: function (e) {
      // 跳转
      wx.navigateTo({
        url: "../more/index"
      });
    },
})

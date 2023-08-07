import dataProvider from '../../service/dataProvider'
import util from '../../service/util'
import { imgBaseURI } from '../../utils/const';

Page({
    data: {
        stars: dataProvider.stars,
        twisters: dataProvider.twisters,
        tip: '',
        question: '',
        answer: [],
        answer_tip: [],
        imageUrl: '',
        show: false,
        shares: dataProvider.shares,
        share: {
          title: '智力不够，就不要来挑战这个游戏了！',
          describle: '',
          image: ''
        },
        status: false,
        isCorrect: false,
        errorCount: 0,
        score: 0,
        num: 0,
        questionCount: 0,
        hidden: true
    },
    onReady: function () {
      this.success_dialog = this.selectComponent('#success_dialog');
      this.fail_dialog = this.selectComponent('#fail_dialog');
      this.tip_dialog = this.selectComponent('#tip_dialog');
    },
    onLoad(opt) {
      let num = parseInt(opt.id);
      if (num) {
          this.generateQue(num);
      } else {
          this.generateQue(0);
      }
    },
    onPullDownRefresh() {
    },
    show_success_dialog: function () {
      this.success_dialog.setData({
        title: '',
        content: '回答正确，炫耀一下吧！',
        cancelText: '炫耀一下',
        okText: '下一关'
      });
      this.success_dialog.show();
    },
    cancelEvent: function() {
      let num = this.data.num;
      this.generateQue(num);
    },
    okEvent: function() {
      let num = this.data.num;
      this.generateQue(num + 1);
      // this.setData({
      //   answer: this.data.twisters[num + 1].answer
      // });
    },
    show_fail_dialog: function () {
      this.fail_dialog.setData({
        title: '',
        content: '回答错误，快去求助好友吧!',
        cancelText: '再试一次',
        okText: '求助好友'
      });
      this.fail_dialog.show();
    },
    show_tip_dialog: function () {
      this.tip_dialog.setData({
        title: '',
        content: this.data.tip,
        cancelText: '知道了',
        okText: '下一关'
      });
      this.tip_dialog.show();
    },
    generateAnswerTip() {
        let arr = [];
        let tips = [];
        let num = this.data.num;
        let length = this.data.twisters.length;
        for (let i = 0; i < length; i++) {
            if (i != num) {
                arr = arr.concat(this.data.twisters[i].answer);
            }
        }
        let reg = /[\u4e00-\u9fa5]/g;
        arr = arr.join('').match(reg);
        arr = util.getArrayItems(arr, 5);
        let options = [];
        if(this.data.twisters[num].options) {
          options = util.shuffle(this.data.twisters[num].options.split(""));
        }else {
          let answer = util.shuffle(this.data.twisters[num].answer.split(""));
          options = arr.concat(answer);
        }
        tips = util.shuffle(options);
        return tips;
    },
    onShareAppMessage: function () {
      const _this = this;
      let score = this.data.score;
      let num = this.data.num;
      let title = '';
      // this.setData({
      //   status: true
      // });
      // this.tip_dialog.cancel();
      if (!this.data.isCorrect) {
        if (score > 0) {
          title = '据说只有 0.01% 的人可以通关！玻璃心勿进！';
        } else {
          title = '敢不敢来测算下你的智商够不够？';
        }
      } else {
        if (score > 0) {
          title = '这个脑筋急转弯太有趣了，我已经过了第' + score + '关，看看你能过几关！';
        } else {
          title = '敢不敢来测算下你的智商够不够？';
        }
      }
      this.setData({
        share: {
          title: title,
        }
      })
      let share = this.data.shares[Math.floor(Math.random() * this.data.shares.length)];
      return {
        title: this.data.share.title,
        // desc: '',
        path: '/pages/twister/index?id=' + this.data.num,
        imageUrl: share.imageUrl,
      }
    },
    pre() {
        let num = this.data.num;
        if (num > 0) {
            num--;
            this.generateQue(num);
            this.setData({
                status: false
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '已经是第一题，请继续下一关。',
                showCancel: false,
                confirmText: 'ok',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }
    },
    next() {
        let num = this.data.num;
        if (num < this.data.twisters.length - 1) {
            num++;
            this.generateQue(num);
            this.setData({
                status: false
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '已经是最后一题，请查看上一题。',
                showCancel: false,
                confirmText: 'ok',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }
    },
    tip() {
      const that = this;
      if(that.data.status) {
          that.show_tip_dialog();
        } else {
            let videoAd = wx.createRewardedVideoAd({
              adUnitId: 'adunit-f08e5a91140542c9'
            })

            videoAd.load()
              .then(() => {
                videoAd.show().catch(() => {
                  videoAd.load().then(() => videoAd.show())
                    .catch(err => {
                      console.log('激励视频 广告显示失败')
                      that.show_tip_dialog();
                    })
                });
              })
            .catch(err => {
              console.log(err.errMsg)
              that.show_tip_dialog();
            })

            videoAd.onClose(res => {
              // 用户点击了【关闭广告】按钮
              if (res && res.isEnded) {
                // 正常播放结束，可以下发游戏奖励
                that.setData({
                  status: true
                })
                that.show_tip_dialog();
              }
            })
            .catch(err => console.log(err.errMsg))
      }
    },
    generateQue(i) {
        let that = this;
        this.setData({
            status: false
        })
        let length = this.data.twisters.length;
        if (i >= length) {
            return false;
        }
        this.setData({
            num: i
        })
        this.setData({
            questionCount: i + 1
        })
        wx.setNavigationBarTitle({
          title: `第${i + 1}关`
        })
        this.setData({
            question: this.data.twisters[i].question
        })
        this.setData({
            tip: this.data.twisters[i].tips
        })
        let arr = this.data.twisters[i].answer.split("");
        this.setData({
            answer: util.generateArray(arr.length)
        })
        this.setData({
            answer_tip: this.generateAnswerTip()
        })
        this.drawCanvas();
    },
    tapAnswer(e) {
        let target = e.target;
        let dataSet = e.target.dataset;
        let item = dataSet.text;
        let index = dataSet.index;
        let arr = this.data.answer;
        arr[index] = ' ';
        this.setData({
            answer: arr
        })
    },
    tapTip(e) {
        let dataSet = e.target.dataset;
        let item = dataSet.text;
        let index = -1;
        let errorCount = 1;
        let arr = this.data.answer;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == ' ') {
                index = i;
                break;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] != ' ') {
                errorCount++;
            }
        }

        arr[index] = item;

        this.setData({
            answer: arr
        })

        this.setData({
            errorCount: errorCount
        })

        let answer = this.data.answer.join('');
        let num = this.data.num;
        if (this.data.twisters[num].answer == answer) {
            this.show_success_dialog();
          let score = this.data.score;
          score++;
          this.setData({
            score: score,
            isCorrect: true
          });
        } else {
            if (this.data.twisters[num].answer.length == this.data.errorCount) {
              this.show_fail_dialog();
              this.setData({
                isCorrect: false
              });
            }
        }
    },
    drawCanvas() {
      let num = this.data.num;
      let promise1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: `${imgBaseURI}/qrcode.jpg`,
          success: function (res) {
            resolve(res);
          }
        })
      });
      let promise2 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: `${imgBaseURI}/bg.jpg`,
          success: function (res) {
            resolve(res);
          }
        })
      });
      Promise.all([
        promise1, promise2
      ]).then(res => {
        const ctx = wx.createCanvasContext('shareImg')

        //主要就是计算好各个图文的位置
        ctx.drawImage('../../' + res[1].path, 0, 0, 545, 771)

        ctx.setTextAlign('center')
        ctx.setFillStyle('#ffffff')
        ctx.setFontSize(22)
        let question = this.data.twisters[num].question;
        ctx.fillText(question, 545 / 2, 80)
        ctx.drawImage('../../' + res[0].path, 158, 480, 200, 200)
        ctx.fillText('长按识别图中二维码更多脑筋急转弯等你来猜！', 545 / 2, 730)

        ctx.stroke()
        ctx.draw()
      })
    },
  /**
   * 生成分享图
  */
  share: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function (res) {
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 关闭poster
   */
  closePoste() {
    this.setData({
      hidden: true
    })
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success(res) {
        console.log("getSetting: success");
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log("1-没有授权《保存图片》权限");

          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log("2-授权《保存图片》权限成功");
              util.downloadImage(downloadUrl);
            },
            fail() {
              // 用户拒绝了授权  
              console.log("2-授权《保存图片》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting: success");
                },
                fail: function (data) {
                  console.log("openSetting: fail");
                }
              });
            }
          })
        } else {
          console.log("1-已经授权《保存图片》权限");
          util.downloadImage(downloadUrl)
        }
      },
      fail(res) {
        console.log("getSetting: success");
      }
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          },
          fail: function (res) {
            console.log('fail ' + res);
          }
        })
      }
    })
  }
})

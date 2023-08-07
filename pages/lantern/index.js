import dataProvider from '../../service/dataProvider'
import util from '../../service/util'
Page({
    data: {
        lanterns: util.shuffle(dataProvider.lanterns),
        tip: '',
        question: '',
        answer: [],
        answer_tip: [],
        imageUrl: '',
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
        questionCount: 0
    },
  onReady: function () {
    this.success_dialog = this.selectComponent('#success_dialog');
    this.fail_dialog = this.selectComponent('#fail_dialog');
    this.tip_dialog = this.selectComponent('#tip_dialog');
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
  okEvent: function () {
    this.success_dialog.close();
    let num = this.data.num;
    this.generateQue(num + 1);
  },
  show_fail_dialog: function () {
    this.fail_dialog.setData({
      title: '',
      content: '回答错误，快去求助好友吧？',
      cancelText: '再试一次',
      okText: '确定'
    });
    this.fail_dialog.show();
  },
  show_tip_dialog: function () {
    this.tip_dialog.setData({
      title: '',
      content: `正确答案： ${this.data.tip}`,
      cancelText: '知道了',
      okText: '下一关'
    });
    this.tip_dialog.show();
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
    // generateAnswerTip() {
    //   let num = this.data.num;
    //   let tip = util.contact(this.data.lanterns[num].answer.split(""), util.generateWord(6))
    //   let arr = [];
    //   for (let i = 0; i < tip.length; i++) {
    //     arr[i] = tip[i];
    //   }
    //   return arr;
    // },
    generateAnswerTip() {
        let arr = [];
        let tips = [];
        let num = this.data.num;
        let length = this.data.lanterns.length;
        for (let i = 0; i < length; i++) {
            if (i != num) {
                arr = arr.concat(this.data.lanterns[i].answer);
            }
        }
        let reg = /[\u4e00-\u9fa5]/g;
        arr = arr.join('').match(reg);
        arr = util.getArrayItems(arr, 5);
        let answer = util.shuffle(this.data.lanterns[num].answer.split(""));
        tips = arr.concat(answer);
        tips = util.shuffle(tips);
        return tips;
    },
    onShareAppMessage: function () {
      let num = this.data.score;
      let title = '';
      this.setData({
        status: true
      });
      this.tip_dialog.cancel();
      if (!this.data.isCorrect) {
        if (num > 0) {
          title = '智力不够，就不要来挑战这个游戏了！';
        } else {
          title = '敢不敢来测算下你的智商够不够？';
        }
        this.setData({
          share: {
            title: title,
          }
        })
      } else {
        if (num > 0) {
          title = '这个灯谜太有趣了，我已经过了第' + num + '关，看看你能过几关！';
        } else {
          title = '带薪上厕所的时候都在玩啥？';
        }
        this.setData({
          share: {
            title: title
          }
        })
      }
        let share = this.data.shares[Math.floor(Math.random() * this.data.shares.length)];
        return {
          title: this.data.share.title,
          // desc: '',
          path: '/pages/lantern/index?id=' + this.data.num,
          imageUrl: share.imageUrl
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
        if (num < this.data.lanterns.length - 1) {
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
      let that = this;
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
                      that.onShareAppMessage();
                    })
                });
              })
            .catch(err => {
              console.log(err.errMsg)
              that.onShareAppMessage();
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
        let length = this.data.lanterns.length;
        if (i >= length) {
            return false;
        }
        this.setData({
            num: i
        })
        this.setData({
            questionCount: i + 1
        })
        this.setData({
            question: this.data.lanterns[i].question
        })
        this.setData({
          tip: this.data.lanterns[i].answer
        })
        let arr = this.data.lanterns[i].answer.split("");
        this.setData({
            answer: util.generateArray(arr.length)
        })
        this.setData({
            answer_tip: this.generateAnswerTip()
        })
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

        if (this.data.lanterns[num].answer == answer) {
          this.show_success_dialog();
          let score = this.data.score;
          score++;
          this.setData({
            score: score,
            isCorrect: true
          });
        } else {
          if (this.data.lanterns[num].answer.length == this.data.errorCount) {
            this.show_fail_dialog();
            this.setData({
              isCorrect: false
            });
          }
        }
    }
})

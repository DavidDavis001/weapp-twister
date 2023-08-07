Component({
  properties: {
    title: {
      type: String,
      value: '标题'
    },
    content: {
      type: String,
      value: '内容'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    okText: {
      type: String,
      value: '确定'
    }
  },
  data: {
    isShow: false
  },
  methods: {
    show: function() {
      this.setData({
        isShow: true
      })
    },
    close: function() {
      this.setData({
        isShow: false
      })
    },
    _okEvent: function () {
      this.close();
      this.triggerEvent('okEvent');
    }
  }
})
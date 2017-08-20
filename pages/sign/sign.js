// pages/sign/sign.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/bg1.png',
      '../../images/bg2.png',
      '../../images/bg3.png'
    ],
    interval:5000,
    duration:2000,
    userInfo: {},
    signClass:'unsign_btn',
    sign_text:'签到',
    total:0,
    cont:0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    //请求该用户是否签到接口
    var url = app.globalData.host + 'api/sign/isSignedToday';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token')
    };
    app.requestFun(url, method, data, cbFun);
    function cbFun(res){
      if(res.code == '200' && res.data.flag == '1'){
        that.setData({
          signClass:'signed_btn',
          sign_text:'已签到'
        });
      }
    }

    //请求签到记录统计数据接口
    var url2 = app.globalData.host + 'api/sign/getSignData';
    var method2 = 'post';
    var data2 = {
      'token': wx.getStorageSync('token')
    };
    app.requestFun(url2, method2, data2, infocbFun);
    function infocbFun(res) {
      if (res.code == '200') {
        that.setData({
          total: res.data.total,
          cont:res.data.cont
        });
      }
    }
  },

  /**
   * 用户签到
   */
  signTap:function(){
    var that = this;
    //请求签到接口
    var url = app.globalData.host + 'api/sign/sign';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token')
    };
    app.requestFun(url, method, data, signcbFun);
    function signcbFun(res) {
      if (res.code == '200') {
        that.setData({
          signClass: 'signed_btn',
          sign_text: '已签到',
          total: res.data.total,
          cont: res.data.cont
        });
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '爱秒小程序',
      path: 'pages/sign/sign',
      success: function (res) {
        // 转发成功
        //console.log('success');
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        //console.log('fail');
        // wx.showToast({
        //   title: '转发失败',
        //   duration: 2000
        // })
      }
    }
  },

  /**
   * 跳转我的记录页面
   */
  recordTap:function(){
    //console.log('navigator');
    wx.navigateTo({
      url: '../../pages/calendar/calendar'
    })
  }
})
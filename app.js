//app.js
App({
  onLaunch: function() {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          //console.log(res.code);
          var url = that.globalData.host + 'api/login';
          var data = {
            code: res.code
          };
          var method = 'get';
          that.requestFun(url,method,data,cbFun);
          function cbFun(res){
            if(res.code == '200'){
              var token = res.data.token;
              //将token缓存起来
              wx.setStorageSync('token',token)
            }else{
              that.showMsg('登录失败','');
            }
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //封装全局请求接口函数
  requestFun:function(url,method,data,callback){
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        callback(res.data);
      }
    })
  },

  //封装全局的消息提示modal框
  showMsg:function(title,content){
    wx.showModal({
      title: title,
      content:content,
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定')
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    host:'https://www.moronghui.cn/'
  }
})

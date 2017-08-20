// lists.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    listsArr: [],
    doneArr:[],
    isTip:false
  },
  /**
   * 添加
   */
  addTap:function(){
    if(this.data.inputValue != ''){
      var that = this;
      var url = app.globalData.host + 'api/list/addList';
      var method = 'post';
      var data = {
        'token': wx.getStorageSync('token'),
        'content':that.data.inputValue
      }
      app.requestFun(url,method,data,cbFun);
      function cbFun(res){
        if(res.code == '200'){
          that.setData({
            inputValue: ""
          });
          that.getList();
        }else{
          app.showMsg('添加失败,请稍后再试!');
        }
      }
    }
  },

  /**
   * 删除一项待办事项
   */
  deleteTap:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    var url = app.globalData.host + 'api/list/deleteOneList';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token'),
      'id': id
    }
    app.requestFun(url, method, data, cbFun);
    function cbFun(res) {
      if (res.code == '200') {
        that.getList();
      } else {
        app.showMsg('删除失败,请稍后再试!');
      }
    }
  },

  /**
   * 完成一项待办事项
   */
  doneTap:function(e){
    var id = e.currentTarget.dataset.id;
    var content = e.currentTarget.dataset.content;
    var that = this;
    var url = app.globalData.host + 'api/list/doneList';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token'),
      'id': id
    }
    app.requestFun(url, method, data, cbFun);
    function cbFun(res) {
      if (res.code == '200') {
        that.getList();
      } else {
        app.showMsg('更新状态失败,请稍后再试!');
      }
    }
  },
  /**
   * 监听input输入的值
   */
  inputTap:function(e){
    this.setData({
      inputValue : e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getList();
  },

  //请求今日待办事项清单方法
  getList:function(){
    //请求今日待办事项清单
    var that = this;
    var url = app.globalData.host + 'api/list/getList';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token')
    };
    app.requestFun(url, method, data, cbFun);
    function cbFun(res) {
      var listArr = [];
      var doneArr = [];
      if (res.code == '200') {
        if (res.data.length == 0) {
          that.setData({
            isTip: true
          });
          return;
        }
        that.setData({
          isTip: false
        });
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].done == '0') {
            res.data[i].checked = false;
            listArr.push(res.data[i]);
          } else {
            doneArr.push(res.data[i]);
          }
        }
      }
      that.setData({
        listsArr: listArr,
        doneArr: doneArr
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
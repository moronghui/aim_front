// pages/data/data.js
var Charts = require('../../utils/wxcharts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    //获取统计数据，完成与未完成
    var that = this;
    var url = app.globalData.host + 'api/list/getListTotal';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token')
    }
    app.requestFun(url, method, data, cbFun);
    function cbFun(res) {
      if (res.code == '200') {
        //绘制饼状图
        new Charts({
          canvasId: 'pieCanvas',
          type: 'pie',
          series: [{
            name: '已完成项(' + res.data.doneTotal+')',
            data: res.data.doneTotal,
          }, {
              name: '未完成项(' + res.data.undoTotal+')',
            data: res.data.undoTotal,
          }],
          width: 400,
          height: 300,
          dataLabel: true
        });
        
      } else {
        app.showMsg('获取数据失败,请稍后再试!');
      }
    }

    //获取统计数据，最近七天完成情况
    var url2 = app.globalData.host + 'api/list/getListRecord';
    var method2 = 'post';
    var data2 = {
      'token': wx.getStorageSync('token')
    }
    app.requestFun(url2, method2, data2, cbFun2);
    function cbFun2(res) {
      if (res.code == '200') {
        //绘制柱状图
        new Charts({
          canvasId: 'columnCanvas',
          type: 'column',
          categories: res.data.categories,
          series: [{
            name: '完成数',
            data: res.data.done
          }, {
            name: '未完成数',
            data: res.data.undo
          }],
          yAxis: {
            format: function (val) {
              return val + '条';
            },
            min:0
          },
          width: 375,
          height: 375,
          dataLabel: true
        });

      } else {
        app.showMsg('获取数据失败,请稍后再试!');
      }
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
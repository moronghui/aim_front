var app = getApp();
const conf = {
  data: {
    // hasEmptyGrid 变量控制是否渲染空格子，若当月第一天是星期天，就不应该渲染空格子
    hasEmptyGrid: false,
    userInfo: {},
    day_select:[]
  },
  // 控制scroll-view高度
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight: res.windowHeight * res.pixelRatio || 667
      });
    } catch (e) {
      console.log(e);
    }
  },
  // 获取当月共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 计算当月1号前空了几个格子
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 绘制当月天数占的格子
  calculateDays(year, month) {
    //请求服务器数据
    var day_select = this.data.day_select;

    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      let obj = {};
      obj.flag = false;
      for (let j = 0; j < day_select.length; j++) {
        if (day_select[j] == i) {
          obj.flag = true;
        }
      }
      obj.value = i;
      days.push(obj);
    }
    this.setData({
      days
    });
  },
  // 初始化数据
  onShow(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //this.calculateEmptyGrids(cur_year, cur_month);
    //this.calculateDays(cur_year, cur_month);
    this.getSystemInfo();
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      //console.log(userInfo);
      that.setData({
        userInfo: userInfo
      })
    })
    //设置导航标题
    wx.setNavigationBarTitle({
      title: that.data.userInfo.nickName+'的签到记录'
    })
    this.getSignRecord(cur_year,cur_month);
  },
  //根据月份请求新数据
  getSignRecord(cur_year,cur_month){
    var that = this;
    var url = app.globalData.host + 'api/sign/getSignRecord';
    var method = 'post';
    var data = {
      'token': wx.getStorageSync('token'),
      'month': cur_year + '-' + (cur_month < 10 ? '0' + cur_month : cur_month)
    };
    app.requestFun(url, method, data, cbFun);
    function cbFun(res) {
      if (res.code == '200') {
        that.setData({
          day_select: res.data.data
        });
      }
      that.calculateEmptyGrids(cur_year, cur_month);
      that.calculateDays(cur_year, cur_month);
    }
  },
  // 切换控制年月
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

      this.getSignRecord(newYear,newMonth);
      //this.calculateDays(newYear, newMonth);
      //this.calculateEmptyGrids(newYear, newMonth);

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
      this.getSignRecord(newYear,newMonth);
      //this.calculateDays(newYear, newMonth);
      //this.calculateEmptyGrids(newYear, newMonth);
    }
  }
};

Page(conf);

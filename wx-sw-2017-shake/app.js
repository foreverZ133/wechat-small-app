//app.js
var apiUrl = 'https://sum.kdcer.com/api/OpenShop';
var testUrl = 'https://192.168.1.139/api/OpenShop';
var isTest = false;

var code = null;
var user = null;
var post_user = null;

var debug = true;

App({
  globalData: {
    userInfo: null,
    main_data: null,
    id: '',
  },
  debug: debug,

  // 获取用户信息
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(that.globalData.userInfo);
        }
      });
    }
  },

  // 获取屏幕宽高
  getScreenInfo: function (cb) {
    var that = this
    if (this.globalData.window) {
      typeof cb == "function" && cb(this.globalData.window)
    } else {
      var res = wx.getSystemInfoSync()
      that.globalData.window = {
        width: res.windowWidth,
        height: res.windowHeight
      }
      typeof cb == "function" && cb(that.globalData.window)
    }
  },

  // 入口接口（包括传入身份与code，初始判断等）
  Login: function (cb) {
    var that = this
    wx.showLoading({
      title: 'loading...',
    });
    code = null;
    wx.login({
      success: function (r1) {
        // console.log('login:', r1);
        if (!r1.code) {
          wx.showModal({
            title: '系统错误：未获取到 code',
            content: JSON.stringify(r1),
          });
          return;
        }
        code = r1.code;
        wx.getUserInfo({
          lang: 'zh_CN',
          withCredentials: true,
          success: function (r2) {
            // console.log('getUserInfo', r2);
            that.globalData.user = r2.userInfo;
            that.globalData.userInfo = r2.userInfo;

            if (debug) {
              that.globalData.id = '2398123471';
              typeof cb == "function" && cb({}, user);
            } else {
              wx.hideLoading();
              wx.showModal({
                content: '非 debug 模式，活动已下线，无法预览。',
              });
            }
          },
          fail: function() {
            wx.hideLoading();
            wx.showModal({
              title: '操作有误',
              content: '请务必开启授权！\n 微信底部菜单点击【发现】>【小程序】> 长按或左滑【玩转购物地】>【删除】，然后重新进入，允许微信授权。\n 我们不想失去你，你也不想失去十万份礼包吧。',
            });
          },
        });
      },
      fail: function () {
        wx.showLoading({
          title: '获取 code 失败，请联系工作人员',
          duration: 99999999,
        });
      },
    });
  },

  // 字符串寻找键值对
  QueryString: function (name, str) {
    var str = decodeURIComponent(str);
    var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(&|$)');
    var r = str.match(reg);
    return r != null ? decodeURIComponent(r[2]) : null;
  },

  // 判断类型
  Type: function (obj) {
    var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
    return typeStr.substr(0, typeStr.length - 1).toLowerCase();
  },

  // 时间字符串转时间
  convertTime: function (d) {
    return new Date(parseInt(d.replace("/Date(", "").replace(")/", ""), 10));
  }
})

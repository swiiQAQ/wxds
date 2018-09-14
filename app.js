//app.js
var { config } = require('utils/config.js');
var { checkStatus } = require('utils/checkStatus.js');
var { errorHandler } = require('utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    var _this = this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          wx.request({
            url: `${config.localhost}/users/login`,
            data:{
              code: res.code
            },
            success: (json)=>{
              errorHandler.fail(json).success(()=>{
                var data = json.data.data;
                //状态判断
                if (data.user) {
                  var status = data.user.status;
                  this.globalData.user = json.data.data.user;
                  wx.setStorage({
                    key: 'status',
                    data: status,
                  })
                  checkStatus(status);
                }
                this.globalData.openId = json.data.data.openId;
                this.setRedBar();
              })
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function(){
    if (this.globalData.openId){
      wx.getStorage({
        key: 'status',
        success: (res)=> {
          wx.request({
            url: `${config.localhost}/users/getUserInfo?openId=${this.globalData.openId}`,
            success: (json) => {
              if (json.data.data && res.data !== json.data.data.status) {
                checkStatus(json.data.data.status);
                wx.setStorage({
                  key: 'status',
                  data: json.data.data.status,
                })
              }
            }
          })
        },
      })
    }
  },
  globalData: {
    userInfo: null,
    currentPageList: [0, 1]
  },
  setRedBar: function(){
    wx.request({
      url: `${config.localhost}/cart/getCartGoodsNum?openId=${this.globalData.openId}`,
      success: (res) => {
        this.globalData.redDot = res.data.data;
        wx.setTabBarBadge({
          index: 2,
          text: String(res.data.data),
        })
      }
    })
  }
})
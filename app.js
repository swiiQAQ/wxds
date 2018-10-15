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

    // 登录ara
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
  },
  onShow: function(){
    if (this.globalData.openId ){
      wx.getStorage({
        key: 'status',
        complete: (res)=> {
          wx.request({
            url: `${config.localhost}/users/getUserInfo?openId=${this.globalData.openId}`,
            success: (json) => {
              if (json.data.data &&( res.data !== json.data.data.status||res.data == undefined)) {
                checkStatus(json.data.data.status);
                wx.setStorage({
                  key: 'status',
                  data: json.data.data.status,
                });
                this.globalData.user = json.data.data;
                this.globalData.status = json.data.data.status;
              }
            }
          })
        },
      })
    }
  },
  globalData: {
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
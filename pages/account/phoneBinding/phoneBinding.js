// pages/account/phoneBinding/phoneBinding.js
var {config} = require("../../../utils/config.js");
var { submitValidate, validateRequired, validate } = require('../../../utils/validate.js');
var { showToast,errorHandler } = require("../../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unbind: false,
    disabledSend: false,
    seconds: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mobile = app.globalData.user.mobile;
    if (!mobile) {
      this.setData({ unbind: true });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  validate: function(e){
    validate(this,e);
  },
  //解绑手机
  unbindPhone:function(){
    this.numValidate().then(()=>{
      wx.request({
        url: `${config.localhost}/users/unbindMobileNo`,
        data: {
          openId: app.globalData.openId,
          mobile: this.data.mobile,
          num: this.data.num
        },
        success: (res) => {
          errorHandler.fail(res).success(()=>{
            wx.showToast({
              title: '解绑成功',
            })
            setTimeout(()=>{
              this.setData({
                unbind: true,
                disabledSend: false,
              })
            },1000)
          })
        }
      })
    })
  },
  // 解绑手机获取验证码
  unbindCode: function(){
    var result = submitValidate(["mobile"],this);
    if(result == true){
      wx.request({
        url: `${config.localhost}/users/unbindGetNum`,
        data: {
          openId: app.globalData.openId,
          mobile: this.data.mobile
        },
        success: (res) => {
          errorHandler.fail(res).success(()=>{
            app.globalData.user.mobile = '';
            this.sendCode();
          })
        }
      })
    }
    else{
      this.setData({ warnText: result})
    }
  },

  numValidate: function(e){
    return new Promise((resolve,reject)=>{
      var result = validateRequired(["mobile","num"],this)
      if(result==true){
        return resolve();
      }
      else{
        wx.showToast({
          title: result,
        })
      }
    })
  },
  //绑定新手机发送验证码  
  bindCode:function(){
    wx.request({
      url: `${config.localhost}/users/bindGetNum`,
      data:{
        openId: app.globalData.openId,
        mobile: this.data.mobile
      },
      success:(res)=>{
        errorHandler.fail(res).success(()=>{
          this.sendCode();
        })
      }
    })
  },
  //绑定新手机号
  bindPhone: function(){
    wx.request({
      url: `${config.localhost}/users/bindMobileNo`,
      data:{
        openId: app.globalData.openId,
        mobile: this.data.mobile,
        num: this.data.num
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          app.globalData.user.mobile = this.data.num;
          wx.showToast({
            title: '绑定成功',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        })
      }
    })
  },
  sendCode: function(){
    this.setData({
      disabledSend: true
    })
    var timer = setInterval(() => {
      if (this.data.seconds > 1) {
        this.setData({ seconds: this.data.seconds - 1 });
      } else {
        clearInterval(timer);
        this.setData({
          disabledSend: false,
          seconds: 60
        })
      }
    }, 1000)
  }
})
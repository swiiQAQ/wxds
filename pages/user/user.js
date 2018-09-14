// pages/user/user.js
var { config } = require('../../utils/config.js');
var { callCustomService } = require('../../utils/util.js');
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
  onLoad: function (options) {
    this.setData({ name: app.globalData.user.name})
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
    this.fetchOrderStatus();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  fetchOrderStatus: function(){
    wx.request({
      url: `${config.localhost}/order/getUnFinishOrderInfo?openId=${app.globalData.openId}`,
      success:(res)=>{
        this.setData({
          unPay: res.data.data.unPay,
          unGet: res.data.data.unGet,
          unSend: res.data.data.unSend
        })
      }
    })
  },
  callPhone: function(){
    callCustomService();
  }
})
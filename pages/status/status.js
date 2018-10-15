// pages/status/status.js
var { checkStatus } = require('../../utils/checkStatus.js');
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
    var data = JSON.parse(options.data);
    // console.log(data);
    this.setData({
      status: data.status,
      text: data.text,
      description: data.description
    });
    
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchStatus();
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
  concatService: function(){
    callCustomService();
  },
  fetchStatus: function(){
    wx.request({
      url: `${config.localhost}/users/getUserInfo?openId=${app.globalData.openId}`,
      success: res => {
        app.globalData.user = res.data.data;
        app.globalData.status = res.data.data.status;
        checkStatus(res.data.data.status);
      }
    })
  }
})
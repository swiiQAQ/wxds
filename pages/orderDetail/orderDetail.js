// pages/orderDetail/orderDetail.js
var { config } = require('../../utils/config.js');
var { errorHandler } = require('../../utils/util.js');
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
    var orderSn = options.orderSn;
    if(options.fromPage){
      this.setData({ back: true});
    }
    wx.request({
      url: `${config.localhost}/order/getOrderDetail`,
      data:{
        openId: app.globalData.openId,
        orderSn: orderSn,
        isHistory: 0
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          this.setData({
            orderInfo: res.data.data.orderInfo,
            goodsInfo: res.data.data.goodsInfo,
            orderDistributeInfo: res.data.data.orderDistributeInfo
          })
        })
      }
    })
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
    if(this.data.back){
      wx.navigateBack({
        delta: 2
      })
    }
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
  
  }
})
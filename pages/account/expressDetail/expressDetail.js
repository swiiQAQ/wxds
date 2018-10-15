// pages/account/expressDetail/expressDetail.js
var { config } = require('../../../utils/config.js');
var { errorHandler } = require('../../../utils/util.js');
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
    wx.request({
      url: `${config.localhost}/order/getOrderShipDetail`,
      data:{
        openId: app.globalData.openId,
        // openId: 'oUyc-5fnqiTSJAMESWHNVnatdX3k',
        isHistory: 0,
        // orderSn: 1809120955132221
        orderSn: orderSn
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          this.setData({
            orderShipInfo: res.data.data.orderShipInfo,
          });
          this.arrTransformer(res.data.data.orderShipInfo, res.data.data.srvList);
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
  arrTransformer: function (orderShipInfo, srvList){
    var newArr = [];
    orderShipInfo.forEach((item)=>{
      newArr.push(srvList[item.invoiceNo]);
    })
    this.setData({ expressList: newArr});
  } 
})
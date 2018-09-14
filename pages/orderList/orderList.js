// pages/order/order.js
var { config } = require('../../utils/config.js');
var { errorHandler } = require('../../utils/util.js'); 
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: ['全部订单','待付款','待发货','待收货'],
    currentState: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.state){
      this.setData({
        currentState: options.state
      })
    }
    this.fetchOrderList(this.data.currentState);
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
  filterOrder: function(e){
    var index = e.target.dataset.index;
    this.fetchOrderList(index);
    this.setData({ currentState: index})
  },
  fetchOrderList: function(orderStatus){
    wx.request({
      url: `${config.localhost}/order/getOrderList`,
      data: {
        openId: app.globalData.openId,
        isHistory: 0,
        p: 1,
        psize: 10,
        orderStatus: orderStatus
      },
      success: (res) => {
        errorHandler.fail(res).success(()=>{
          this.setData({ orderList: res.data.data.results });
        })
      }
    })
  },
  //去付款
  payFor: function(e){
    var orderSn = e.target.dataset.ordersn;
    wx.request({
      url: `${config.localhost}/pay/payOrder`,
    data: {
        openId: app.globalData.openId,
        orderSn: orderSn,
        money: 1
      },
      success: (res) => {
        errorHandler.fail(res).success(()=>{
          var data = res.data.data;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function () {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?orderSn=' + orderSn,
              })
            },
            'fail': function () {
            },
            'complete': function () {
            }
          })
        })
      }
    })
  },
  //取消订单
  cancelOrder: function(e){
    var orderSn = e.target.dataset.ordersn;
    wx.showModal({
      title: '确认取消订单？',
      content: '取消订单后无法恢复订单',
      cancelText: '不取消',
      confirmText: '取消订单',
      success: (res)=>{
        if(res.confirm){
          wx.request({
            url: `${config.localhost}/order/cancelOrder`,
            data:{
              openId: app.globalData.openId,
              orderSn: orderSn
            },
            success:(res)=>{
              errorHandler.fail(res).success(()=>{
                wx.showToast({
                  title: '已取消'
                })
                this.fetchOrderList(this.data.currentState);
              })
            }
          })
        }
      }
    })
  },
  //提醒发货
  remind: function(){
    wx.showToast({
      title: '已通知仓库处理配送问题',
    })
  },
  //确认收货
  confirmOrder: function(e){
    var orderSn = e.target.dataset.ordersn;
    wx.request({
      url: `${config.localhost}/order/confirmOrder`,
      data:{
        openId: app.globalData.openId,
        orderSn: orderSn
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          this.fetchOrderList(this.data.currentState);
        })
      }
    })
  }
})
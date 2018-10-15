// pages/sign/cashPledge/cashPledge.js
var { config } = require("../../../utils/config.js");
var { errorHandler, callCustomService } = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: config.customServicePhone
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status = options.status
    if(status == 11){
      wx.showToast({
        title: '保证金审核未通过',
        icon: 'none',
        duration: 3000
      })
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
  cashPledge: function(){
    wx.request({
      url: `${config.localhost}/pay/payDeposit`,
      data:{
        openId: app.globalData.openId,
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res) {
              var data = {
                status: 'waiting',
                text: '保证金已交',
                description: ['财务将核实您的支付情况，', '通过后将已短信通知您审核结果，请耐心等待…']
              }
              data = JSON.stringify(data);
              wx.redirectTo({
                url: `/pages/status/status?data=${data}`,
              })
            },
            'fail': function (res) {
            }
          })
        })
      }
    })
  },
  callCustomService: function(){
    callCustomService();
  }
})
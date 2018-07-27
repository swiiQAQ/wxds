// pages/register/register.js
var app = getApp();
var reg = require('../../utils/regexp.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //禁止重发
    disabledSend: false,
    //报错信息
    warnText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  savePhone:function(e){
    this.setData({ phone : e.detail.value});
  },
  sendCode: function(){
    wx.request({
      url: 'http://10.8.33.20:8081/wxfx.mobileServer/users/validateMobile',
      data:{
        mobile: this.data.phone,
        openId: app.globalData.openId
      },
      success: json => {
        if(json.data.code == '0'){
          this.setData({ warnText: json.data.message})
        }
        console.log(json);
      }
    })
    // this.setData({ disabledSend: true})
  },
  idCardReg:function(e){
    if (!reg.idCardReg(e.detail.value)){
      this.setData({ warnText : '身份证格式错误'})
    }
  },
  forwardStauts:function(){
    var data ={
      status : 'waiting',
      text : '申请审核中...',
      description : ['我们工作人员正在对您的资质进行审核', '通过后将会短信通知您审核结果，请耐心等待...']
    }
    data = JSON.stringify(data);
    wx.redirectTo({
      url: `/pages/status/status?data=${data}`,
    })
  }
})
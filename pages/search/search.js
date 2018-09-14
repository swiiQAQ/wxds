// pages/search/search.js
var { config } = require('../../utils/config.js');
var { errorHandler } = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: ['衬衫', '优惠促销', '连衣裙', '衬衫', '优惠促销', '连衣裙']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: `${config.localhost}/product/getHotWords?openId=${app.globalData.openId}`,
      success: res=>{
        errorHandler.fail(res).success(()=>{
          this.setData({ keywords: res.data.data })
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
  inputSearch:function(e){
    var words = e.detail.value;
    this.setData({ searchText: words});
  },
  selectKeywords: function(e){
    var index = e.target.dataset.index;
    var word = e.target.dataset.word;
    this.setData({
      id: index
    });
    wx.redirectTo({
      url: '/pages/goodsList/goodsList?searchText=' + word,
    })
  },
  search: function(){
    var searchText = this.data.searchText;
    wx.redirectTo({
      url: '/pages/goodsList/goodsList?searchText=' + searchText,
    })
  },
  clear: function(){
    this.setData({ searchText: ''});
  }
})
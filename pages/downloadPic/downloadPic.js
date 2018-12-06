// pages/canvasTest/canvasTest.js
var { config } = require('../../utils/config.js');
var app = getApp();
var { multiDownload } = require('../../utils/multiDownload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选中的图片
    selectedList: [],
    selectAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productCode = options.productCode;
    var galleryList;
    wx.request({
      url: `${config.localhost}/product/getProductImgs?productCode=${productCode}&openId=${app.globalData.openId}`,
      success: (res) => {
        this.setData({
          defaultGallery: res.data.data.imgUrls,
          productName: res.data.data.productName,
          sellerPoint: res.data.data.sellerPoint,
          sizeList: res.data.data.sizeList,
        });
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
  selectImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.selectedList;
    var exist = false;
    list.forEach((item, id) => {
      if (item == index) {
        list.splice(id, 1);
        exist = true;
        this.setData({ selectedList: list });
      }
    })
    
    if (!exist) {
      list.push(index);
      if(list.length == this.data.defaultGallery.length){
        this.setData({ selectAll: true});
      }
      this.setData({ selectedList: list });
    }
    else{
      this.setData({ selectAll: false });
    }
  },
  clearSelectedHandler: function () {
    this.setData({ selectedList: [] });
  },
  createCanvas: function () {
    var selectedList = this.data.selectedList;
    if (selectedList.length == 0) {
      wx.showToast({
        title: '请选择图片',
        icon: 'none'
      });
      return;
    }
    var galleryList = [];
    var dpi = config.dpi;
    var length = selectedList.length;
    if (length == 6) {
      // 将数组映射成代表图片的数组
      selectedList.forEach((item) => {
        galleryList.push(this.data.defaultGallery[item]);
      })
      // this.setData({ height: Math.ceil(length / 2) * 120 });
      multiDownload(galleryList, (tempList) => {
      });
    }
  },
  selectAllHandler:function(){
    if(!this.data.selectAll){
      var tempList = [];
      var length = this.data.defaultGallery.length;
      for(let i =0;i<length;i++){
        tempList.push(i);
      }
      this.setData({ selectedList: tempList })
    }
    else{
      this.setData({ selectedList: []});
    }
    this.setData({ selectAll : !this.data.selectAll});
  }
})
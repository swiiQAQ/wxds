var { config } = require('../../utils/config.js');
var { submitValidate, regValidate } = require('../../utils/validate.js');
var { errorHandler } = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    addressId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var select = options.select;
    if(select){
      this.setData({ select : true});
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
    this.fetchAddressList().then((data)=>{
      this.setData({ addressList: data });
    })
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
  redirectExpress: function(e){
    var index = e.currentTarget.dataset.index;
    var expressItem = this.data.addressList[index];
    expressItem = JSON.stringify(expressItem);
    wx.navigateTo({
      url: `/pages/addressInsert/addressInsert?expressItem=${expressItem}`
    })
  },
  //删除地址
  deleteAddress: function(e){
    var addressId = e.target.dataset.addressid;
    wx.request({
      url: `${config.localhost}/userAddress/delete`,
      data:{
        addressId: addressId,
        openId: app.globalData.openId
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          this.fetchAddressList().then((data) => {
            this.setData({ addressList: data })
          });
        })
      }
    })
  },
  changeSelect: function(e){
    this.setData({ addressDetail: e.detail.value});
  },
  selectAddress: function(){
    if(!this.data.addressDetail){
      wx.showToast({
        title: '未选择地址',
        icon: 'none'
      });
      return;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({ addressDetail: this.data.addressDetail });
    wx.navigateBack({
      delta: 1
    })
  },
  fetchAddressList: function(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${config.localhost}/userAddress/getList?openId=${app.globalData.openId}`,
        success: (res) => {
          errorHandler.fail(res).success(()=>{
            var data = res.data.data;
            return resolve(data);
          })
        }
      })
    })
  },
  //新增地址
  insertAddress: function(){
    if (this.data.addressList.length==10){
      wx.showModal({
        title: '提示',
        content: '您的地址数量已达上限，请调整数量',
        showCancel: false
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/addressInsert/addressInsert',
      })
    }
  }
})

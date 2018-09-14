// pages/cart/cart.js
var {config} = require('../../utils/config.js');
var { createArr, setRedDot, errorHandler, showToast} = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //手机高度
    // checkList: [],
    scrollHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: app.globalData.windowHeightWithBar - 142 / config.dpi
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
    this.refreshCart();
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
  refreshCart: function(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${config.localhost}/cart/refreashCart?openId=${app.globalData.openId}`,
        success: (res) => {
          errorHandler.fail(res).success(()=>{
            var cartMap = res.data.data.cartMap;
            if (Object.keys(cartMap).length == 0) {
              this.setData({ cartItems: '' })
            } else {
              for (var key in cartMap) {
                this.setData({
                  cartItems: cartMap[key].cartItems,
                  totalPrice: cartMap[key].totalPrice,
                  goodsTotalNumber: cartMap[key].goodsTotalNumber,
                  checkStatus: res.data.data.checkStatus
                })
                return resolve(cartMap[key].cartItems.length);
              }
            }
          })
          this.getCartNum();
          
        }
      })
    })
  },
  getCartNum: function(){
    wx.request({
      url: `${config.localhost}/cart/getCartGoodsNum?openId=${app.globalData.openId}`,
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          app.globalData.redDot = res.data.data;
          setRedDot(app);
        })
      }
    })
  },
  //修改商品数量
  decrease: function(e){
    var id = e.currentTarget.dataset.id;
    var quantity = e.currentTarget.dataset.quantity;
    this.fetchModifyCount(id, quantity-1);
  },
  increase: function(e){
    var id = e.currentTarget.dataset.id;
    var quantity = e.currentTarget.dataset.quantity;
    this.fetchModifyCount(id, quantity + 1);
  },
  //输入框修改数量
  inputModify: function(e){
    var id = e.currentTarget.dataset.id;
    var quantity = e.detail.value;
    this.fetchModifyCount(id, quantity);
  },
  fetchModifyCount: function(id, count){
    wx.request({
      url: `${config.localhost}/cart/modifyProductCount`,
      data: {
        openId: app.globalData.openId,
        cartItemId: id,
        count: count
      },
      success: (res) => {
        errorHandler.fail(res);
        this.refreshCart();
      }
    })
  },
  //删除商品
  deleteGoods: function(e){
    var id = e.target.dataset.id;
    wx.request({
      url: `${config.localhost}/cart/removeProduct`,
      data:{
        openId: app.globalData.openId,
        cartItemId: id,
        
      },
      success: (res) => {
        errorHandler.fail(res);
        this.refreshCart();
      }
    })
  },
  //全选按钮
  selectAllHandler: function(){
    var checkStatus = this.data.checkStatus;
    wx.request({
      url: `${config.localhost}/cart/updateCartItemStatus`,
      data:{
        openId: app.globalData.openId,
        checkStatus: Number(!checkStatus)
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          this.refreshCart().then((num) => {
            this.setData({
              checkStatus: !checkStatus,
            })
          })
        })
      }
    })
  },
  //单选按钮
  changeSelectHandler: function(e){
    var index = e.target.dataset.index;
    var id = e.target.dataset.id;
    var checkStatus = e.target.dataset.checkstatus;
    wx.request({
      url: `${config.localhost}/cart/checkCartItemStatus`,
      data:{
        openId: app.globalData.openId,
        cartItemId: id,
        checkStatus: checkStatus == 1? 0: 1
      },
      success: (res)=>{
        errorHandler.fail(res).success(()=>{
          this.refreshCart()
        })
      }
    })
  },
  goToPay: function(){
    if(this.data.goodsTotalNumber){  
      wx.navigateTo({
        url: '/pages/createOrder/createOrder',
      })
    }
    else{
      showToast('未选择商品')
    }
  },
  linkGoods: function(e){
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?productCode='+code,
    })
  },
})
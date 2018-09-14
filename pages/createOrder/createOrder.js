// pages/createOrder/createOrder.js
var {config} = require('../../utils/config.js');
var { validate, validateRequired } = require('../../utils/validate.js');
var { errorHandler } = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '',
    config: config,
    shippingFee: 0,
    isOrderPrint: false,
    invPayee: '个人'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flashFlag = options.flashFlag? options.flashFlag: '';
    this.setData({ 
      flashFlag: flashFlag,
      scrollHeight: app.globalData.windowHeightWithoutBar - 144 / config.dpi
    });
    wx.request({
      url: `${config.localhost}/cart/refreashCartToOrderService`,
      data: {
        openId: app.globalData.openId,
        flashFlag: flashFlag
      },
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
              })
            }
          }
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
    var addressDetail = this.data.addressDetail;
    if (addressDetail){
      var splitArr = addressDetail.split("-");
      this.setData({
        addressId: splitArr[0],
        name: splitArr[1],
        mobile: splitArr[2],
        address: splitArr[3],
      });
      this.fetchShippingFee(splitArr[4])
    };
    
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
  //查看运费
  fetchShippingFee: function (provinceId){
    wx.request({
      url: `${config.localhost}/userAddress/getShippingFee`,
      data:{
        zoneId: provinceId,
        openId: app.globalData.openId
      },
      success:(res)=>{
        errorHandler.fail(res).success(()=>{
          this.setData({ shippingFee: res.data.data.shippingFee })
        })
      }
    })
  },
  createOrder: function(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: `${config.localhost}/order/createOrder`,
        data: {
          openId: app.globalData.openId,
          addressId: this.data.addressId,
          invPayee: this.data.invPayee,
          shippingCode: 99,
          isOrderPrint: Number(this.data.isOrderPrint),
          flashFlag: this.data.flashFlag
        },
        success: (res) => {
          errorHandler.fail(res).success(()=>{
            return resolve(res.data.data);
          })
        }
      })
    })
  },
  wechatPay: function(){
    var result = validateRequired(['addressId'],this);
    if(result == true){
      this.createOrder().then((data) => {
        var orderSn = data.result;
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
                },
                'fail': function () {
                },
                'complete': function () {
                  wx.navigateTo({
                    url: `/pages/orderDetail/orderDetail?orderSn=${orderSn}&fromPage=create`,
                  })
                }
              })
            })
          }
        })
      })
    }
    else{
      wx.showToast({
        title: result,
        icon: 'none'
      })
    }
  },

  isNeedInvoice: function(e){
    this.setData({ isOrderPrint : e.detail.value});
  },
  validate: function(e){
    validate(this,e);
  }
})
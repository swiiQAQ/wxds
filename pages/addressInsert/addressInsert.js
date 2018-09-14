// pages/expressSelect/expressSelect.js
var {submitValidate} = require('../../utils/validate.js');
var { config } = require("../../utils/config.js");
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
  onLoad: function(options) {
    if(options.expressItem){
      var obj = JSON.parse(options.expressItem)
      this.setData({ 
        area:{
          provinceId: obj.province,
          cityId: obj.city,
          districtId: obj.district,
        },
        name: obj.consignee,
        addressId: obj.addressId,
        mobile: obj.mobile,
        provinceName: obj.provinceName,
        cityName: obj.cityName,
        districtName: obj.districtName,
        zipCode: obj.zipcode,
        expressDetail: obj.address
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  validate: function(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    });
  },
  setPickerValue: function(e){
    this.setData({
      area: e.detail
    })
    // this.setData({

    // })
  },
  expressSubmit: function(e) {
    var detail = e.detail.value;
    var result = submitValidate(["name", 'mobile', 'area', 'expressDetail','zipCode',],this);
    // console.log(result);
    if (result === true) {
    this.setData({ warnText: ''});
      wx.request({
        url: `${config.localhost}/userAddress/addOrEdit`,
        header: {
          'content-type': 'application/x-www-form-urlencoded ;charset=utf-8 ',
        },
        data: {
          addressId: this.data.addressId,
          openId: app.globalData.openId,
          consignee: this.data.name,
          mobile: this.data.mobile,
          address: this.data.expressDetail,
          zipCode: this.data.zipCode ? this.data.zipCode : '',
          provinceId: this.data.area.provinceId,
          cityId: this.data.area.cityId,
          districtId: this.data.area.districtId,
          addressId: this.data.addressId ? this.data.addressId : ''
        },
        success: (res) => {
          errorHandler.fail(res,()=>{
            this.setData({ warnText: res.data.message });
          }).success(()=>{
            wx.navigateBack({
              delta: 1
            })
          })
        }
      })
    }
   else {
    this.setData({
      warnText: result
    });
   }
  }
})
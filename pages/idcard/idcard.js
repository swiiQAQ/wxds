// pages/idcard/idcard.js
var {
  config
} = require('../../utils/config.js');
var {
  validateRequired
} = require('../../utils/validate.js');
var { errorHandler, callCustomService } = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: config.customServicePhone,
    // 身份证前面
    // frontPhoto: '',
    // 身份证后面
    // backPhoto: ''
    idCard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  checkIdcard: function() {
    var result = validateRequired(['idCard0', 'idCard1'], this);
    if (result !== true) {
      this.setData({
        warnText: result
      });
      return;
    }
    this.setData({
      warnText: ''
    });
    // wx.redirectTo({
    //   url: '/pages/register/register?idcard=true'
    // })

    wx.request({
      url: `${config.localhost}/users/getSignature?openId=${app.globalData.openId}`,
      success: (res) => {
        errorHandler.fail(res).success(()=>{
          var data = res.data.data;
          app.globalData.ossConfig = {
            accessid: data.accessid,
            dir: data.dir,
            expire: data.expire,
            host: data.host,
            policy: data.policy,
            signature: data.signature
          }

          this.ossUpload().then(() => {
            //返回注册页面，身份证认证通过
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
              photo: true,
              warnText: ''
            });
            wx.navigateBack({
              delta: 1
            })
          })
        })
      }
    })
  },
  uploadFront: function() {
    wx.chooseImage({
      sizeType: 'compressed',
      success: res => {
        var tempFilePaths = res.tempFilePaths[0];
        this.setData({
          'idCard0': tempFilePaths
        })
      },
    })
  },
  uploadBack: function() {
    wx.chooseImage({
      sizeType: 'original',
      success: res => {
        var tempFilePaths = res.tempFilePaths[0];

        this.setData({
          'idCard1': tempFilePaths
        })
      },
    })
  },
  //上传阿里云
  ossUpload: function() {
    var ossConfig = app.globalData.ossConfig;
    
    return new Promise((resolve, reject) => {
      for (var i = 0; i < 2; i++) {
        wx.uploadFile({
          url: `${ossConfig.host}`,
          filePath: this.data['idCard' + i],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            'key': `${ossConfig.dir}/${app.globalData.openId}/${i}.jpg`,
            'policy': ossConfig.policy,
            'OSSAccessKeyId': ossConfig.accessid,
            'signature': ossConfig.signature,
            'success_action_status': '200'
          },
          success: function(res) {
            return resolve()
          },
          fail: function(res) {

          },
          complete: function(res) {},
        })
      }
    })
  },
  callPhone: function(){
    callCustomService();
  }
})
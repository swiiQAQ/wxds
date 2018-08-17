// pages/idcard/idcard.js
var {config} = require('../../utils/config.js');
var { validateRequired } = require('../../utils/validate.js');
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

  checkIdcard:function(){
    var result = validateRequired(['idCard0', 'idCard1'],this);
    if(result !== true){
      this.setData({ warnText: result});
      return;
    }
    this.setData({ warnText: ''});
    // wx.redirectTo({
    //   url: '/pages/register/register?idcard=true'
    // })

    wx.request({
      url: `${config.localhost}/wxfx.mobileServer/users/getSignature?openId=${app.globalData.openId}`,
      success: (res)=>{
        var message = res.data.message;
        app.globalData.ossConfig={
          accessid: message.accessid,
          dir: message.dir,
          expire: message.expire,
          host: message.host,
          policy: message.policy,
          signature: message.signature
        }
        
        this.ossUpload()        
      }
    })
  },
  uploadFront: function(){
    wx.chooseImage({
      sizeType: 'original',
      success: res => {
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        this.setData({ 'idCard0': tempFilePaths })
      },
    })
  },
  uploadBack: function () {
    wx.chooseImage({
      sizeType: 'original',
      success: res => {
        var tempFilePaths = res.tempFilePaths[0];

        this.setData({ 'idCard1': tempFilePaths })
      },
    })
  },
  //上传阿里云
  ossUpload: function(){
    
    var ossConfig = app.globalData.ossConfig;
    wx.uploadFile({
      url: `${ossConfig.host}`,
      filePath: this.data.idCard0,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'key': ossConfig.dir+'/0.png',
        'policy': ossConfig.policy,
        'OSSAccessKeyId': ossConfig.accessid,
        'signature': ossConfig.signature,
        'success_action_status': '200'
      },
      success: function(res) {
        //返回注册页面，身份证认证通过
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({ photo: true});
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function(res) {
        
      },
      complete: function(res) {},
    })
  }
})
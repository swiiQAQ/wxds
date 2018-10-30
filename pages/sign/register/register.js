// pages/sign/register/register.js
var app = getApp();
var { submitValidate, regValidate, validate} = require('../../../utils/validate.js');
var {config} = require('../../../utils/config.js');
var { errorHandler } = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //禁止重发
    disabledSend: false,
    //报错信息
    warnText: '',
    multiArray: [],
    multiIndex: [0,0],
    photo: '',
    seconds: 60,
    disabledChange: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var year = (new Date).getFullYear();
    var arr1=[],arr2 = [];
    for(let i = year; i< year+20;i++){
      arr2.push(i);
    }
    for(let i =1;i<13;i++){
      if(i<10){
        i= '0'+ i;
      }
      arr1.push(i);
    }
    this.setData({ multiArray: [arr1,arr2]});

    //身份证审核未通过情况
    if (app.globalData.user&&app.globalData.user.status == 0){
      wx.showToast({
        title: '身份证审核未通过',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        disabledChange: 1,
        name: app.globalData.user.name,
        mobile: app.globalData.user.mobile,
        num: '******'
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

  savePhone:function(e){
    this.setData({ phone : e.detail.value});
  },
  sendCode: function(){
    wx.request({
      url: `${config.localhost}/users/validateMobile`,
      data:{
        mobile: this.data.mobile,
        openId: app.globalData.openId
      },
      success: res => {
        errorHandler.fail(res,()=>{
          this.setData({
            warnText: res.data.message,
          })
        }).success(()=>{
          this.setData({
            disabledSend: true
          })
          var timer = setInterval(()=>{
            if(this.data.seconds >1){
              this.setData({ seconds: this.data.seconds - 1 });
            }else{
              clearInterval(timer);
              this.setData({
                disabledSend: false,
                seconds: 60
              })
            }
          },1000)
        })
      }
    })
    // this.setData({ disabledSend: true})
  },
  // idCardReg:function(e){
  //   if (!idCardReg(e.detail.value)){
  //     this.setData({ warnText : '身份证格式错误'})
  //   }
  // },
  register:function(){
    if( !app.globalData.user){
      this.registerInit();
    }
    else if (app.globalData.user.status == 0){
      this.editForm();
    }
  },
  validate: function(e){
    validate(this, e);
    
  },
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var value = e.detail.value;
    var multiArray = this.data.multiArray;
    var expire =  multiArray[0][value[0]]+'/'+multiArray[1][value[1]];
    this.setData({
      multiIndex: value,
      expire: expire
    })
  },
  //第一次注册
  registerInit: function(){
    var result = submitValidate(['name', 'mobile', 'idCard', 'expire', 'num', 'photo'], this);
    if (result === true) {
      wx.request({
        url: `${config.localhost}/users/registry`,
        header: {
          'content-type': 'application/x-www-form-urlencoded ;charset=utf-8 ',
        },
        data: {
          openId: app.globalData.openId,
          name: this.data.name,
          mobile: this.data.mobile,
          idCard: this.data.idCard,
          expiryDate: this.data.expire,
          num: this.data.num
        },
        success: (res)=>{
          errorHandler.fail(res).success(()=>{
            this.redirectState();
          })
        }
      })
    }
    else {
      this.setData({ warnText: result });
    }
  },
  //修改身份证相关信息
  editForm: function(){
    var result = submitValidate(['idCard', 'expire', 'photo'],this);
    if(result == true){
      wx.request({
        url: `${config.localhost}/users/modifyIdCard`,
        data: {
          openId: app.globalData.openId,
          idCard: this.data.idCard,
          expiryDate: this.data.expire,
        },
        success: (res) => {
          errorHandler.fail(res,()=>{
            this.setData({ warnText: res.data.message })
          }).success(()=>{
            this.redirectState();
          })
        }
      })
    }
    else{
      this.setData({ warnText: result});
    }
  },
  //跳转状态页面
  redirectState: function(){
    var data = {
      status: 'waiting',
      text: '申请审核中...',
      description: ['您的信息正在审核', '请耐心等待并请关注手机短信通知']
    }
    data = JSON.stringify(data);
    wx.redirectTo({
      url: `/pages/status/status?data=${data}`,
    })
  }
})
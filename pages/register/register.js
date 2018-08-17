// pages/register/register.js
var app = getApp();
var { submitValidate, regValidate} = require('../../utils/validate.js');
var {config} = require('../../utils/config.js');



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
    photo: false
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
      url: `${config.localhost}/wxfx.mobileServer/users/validateMobile`,
      data:{
        mobile: this.data.mobile,
        // openId: app.globalData.openId
        openId: config.testOpenId
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
  // idCardReg:function(e){
  //   if (!idCardReg(e.detail.value)){
  //     this.setData({ warnText : '身份证格式错误'})
  //   }
  // },
  register:function(){
    var result = submitValidate(['name', 'mobile','idCardNum','expire','num','photo'],this);
    if(result === true){
      wx.request({
        url: `${config.localhost}/wxfx.mobileServer/users/registry`,
        header: {
          'content-type': 'application/x-www-form-urlencoded ;charset=utf-8 ',
        },
        data: {
          // openId: config.testOpenId,
          openId: app.globalData.openId,
          name: this.data.name,
          mobile: this.data.mobile,
          idCardNum: this.data.idCardNum,
          expiryDate: this.data.expire,
          num: this.data.num
        },
        success: function (res) {
          console.log(res);
        },
      })
    }
    else{
      this.setData({ warnText: result});
    }
    // var data ={
    //   status : 'waiting',
    //   text : '申请审核中...',
    //   description : ['我们工作人员正在对您的资质进行审核', '通过后将会短信通知您审核结果，请耐心等待...']
    // }
    // data = JSON.stringify(data);
    // wx.redirectTo({
    //   url: `/pages/status/status?data=${data}`,
    // })
  },
  validate: function(e){
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    });
    var result = regValidate(e.currentTarget.dataset.name,this);
    if(result!==true){
      this.setData({ warnText: result});
    }
    else{
      this.setData({ 
        warnText: '',
      });
    }
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var value = e.detail.value;
    var multiArray = this.data.multiArray;
    var expire =  multiArray[0][value[0]]+'/'+multiArray[1][value[1]];
    this.setData({
      multiIndex: value,
      expire: expire
    })
  },
})
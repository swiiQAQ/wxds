const { checkStatus } = require('checkStatus.js');
const { config } = require('config.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//创建某个长度的数组
var createArr = function(length, value){
  var arr = [];
  for(let i=0;i<length;i++){
    arr.push(value);
  }
  return arr;
}

//简单提示
var showToast = (title)=>{
  wx.showToast({
    title: title,
    icon: 'none'
  })
}

//设置购物车小红点数量
var setRedDot = (app)=>{
  if (app.globalData.redDot == null){
    return;
  }
  if (app.globalData.redDot == 0) {
    wx.removeTabBarBadge({
      index: 2,
    })
  }
  else if (app.globalData.redDot > 99) {
    wx.setTabBarBadge({
      index: 2,
      text: '99+',
    })
  }
  else {
    wx.setTabBarBadge({
      index: 2,
      text: String(app.globalData.redDot),
    })
  }
}

var callCustomService = ()=>{
  wx.makePhoneCall({
    phoneNumber: config.customServicePhone,
  })
}

//接口错误处理
// var errorHandler =  (res,callback)=>{
//   if(res.data.code == 0){
//     if (callback){
//       callback()
//     }
//     else{
//       wx.showToast({
//         title: res.data.message,
//         icon: ''
//       })
//     }
//     return false;
//   }
//   else if(res.data.code == -1){
//     checkStatus(-1);
//     return false;
//   }
//   else{
//     return true
//   }
// }

var errorHandler = {
  fail: function (res, callback){
    this.code = res.data.code;
    if (res.data.code == 0) {
      if (callback) {
        callback()
      }
      else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    }
    //黑名单
    else if (res.data.code == -1) {
      checkStatus(-1);
    }
    return this
  },
  success: function(callback){
    if(this.code == 1){
      callback();
    }
  }
}


module.exports = {
  formatTime: formatTime,
  createArr: createArr,
  showToast: showToast,
  setRedDot: setRedDot,
  errorHandler: errorHandler,
  callCustomService: callCustomService
}

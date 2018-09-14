var dpi;
wx.getSystemInfo({
  success: function (res) {
    var screenWidth = res.screenWidth;
    dpi = 750 / screenWidth;
    // screenHeight = res.screenHeight;
    // statusBarHeight = res.statusBarHeight
  },
})
var config = {
  customServicePhone: '400-821-9988',
  localhost: 'http://10.100.28.172:8080/wxfx.mobileServer', //测试环境
  // localhost: 'http://10.8.154.87:8081/wxfx.mobileServer', //本地环境
  testOpenId: 'wx039fa5e93cf51b8e',
  dpi: dpi,
}


module.exports={
  config: config
}


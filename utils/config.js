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
  localhost: 'https://wxfx.bonwego.com/wxfx.mobileServer', //正式环境
  // localhost: 'https://wxfx.mb95.com/wxfx.mobileServer', //测试环境
  // localhost: 'http://10.8.154.105:8081/wxfx.mobileServer', //本地环境
  testOpenId: 'wx039fa5e93cf51b8e',
  picHost: 'http://pic.bonwego.com',
  // picHost: 'http://pic.banggo.com',
  dpi: dpi,
}


module.exports={
  config: config
}


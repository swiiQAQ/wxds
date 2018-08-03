var dpi;
wx.getSystemInfo({
  success: function (res) {
    var screenWidth = res.screenWidth;
    dpi = 750 / screenWidth;
  },
})
var config = {
  customServicePhone: '400-400-4000',
  // localhost: 'http://10.100.28.172:8080', //测试环境
  localhost: 'http://10.8.33.20:8081', //本地环境
  testOpenId: 'wx039fa5e93cf51b8e',
  dpi: dpi
}


module.exports={
  config: config
}


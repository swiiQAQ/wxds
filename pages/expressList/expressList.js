var { config } = require('../../utils/config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiObject: [
      [{regionName:'省'}],
      [{ regionName: '市'}],
      [{ regionName: '县'}]
    ],
    multiArray:[
      ['省'],
      ['市'],
      ['县']
    ],
    zoneId:[0,2,36],
    multiIndex:[0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化省
    this.fetchZoneList(0);
    // 初始化市
    this.fetchZoneList(1)
    // 初始化县
    this.fetchZoneList(2)
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

  fetchZoneList: function(zoneIndex,callback){
    var zoneId = this.data.zoneId[zoneIndex];
    wx.request({
      url: `${config.localhost}/wxfx.mobileServer/userAddress/getZoneList?zoneId=${zoneId}&openId=${config.testOpenId}`,
      success: (res)=>{
        var data = res.data.data;
        var area = data.map((obj) => {
          return obj.regionName
        })
        var multiArray = `multiArray[${zoneIndex}]`;
        var multiObject = `multiObject[${zoneIndex}]`
        this.setData({
          [multiArray]: area,
          [multiObject]: data
        });
        if(callback){
          callback(data);
        }
      }
    })
  },
  columnChangeHandler: function(e){
    var index;
    index = e.detail.value;
    if(e.detail.column == 0){
      var regionId = this.data.multiObject[0][index].regionId;
      this.setData({ ['zoneId[1]']: regionId })
      this.fetchZoneList(1, (data) => {
        var regionId = data[0].regionId;
        this.setData({ ['zoneId[2]']: regionId });
        this.fetchZoneList(2);
      });
    }
    else if(e.detail.column == 1){
      var regionId = this.data.multiObject[1][index].regionId;
      this.setData({ ['zoneId[2]']: regionId })
      this.fetchZoneList(2);
    }
  },
  valueChangeHandler: function(e){
    var value = e.detail.value;
    var countyId = this.data.multiObject[2][value[2]].regionId;
    this.setData({ 
      provinceId: this.data.zoneId[1],
      cityId: this.data.zoneId[2],
      countyId: countyId,
      multiIndex: value 
    });
  }
})

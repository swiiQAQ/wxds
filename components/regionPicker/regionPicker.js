// components/regionPicker/regionPicker.js
var {config} = require('../../utils/config.js');
var { errorHandler } = require('../../utils/util.js');
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    province: String,
    city: String,
    district: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    multiObject: [
      [{ regionName: '省' }],
      [{ regionName: '市' }],
      [{ regionName: '县' }]
    ],
    multiArray: [
      ['省'],
      ['市'],
      ['县']
    ],
    zoneId: [0, 2, 36],
    multiIndex: [0, 0, 0],
    showPicker: false
  },
  //
  ready: function(){
    //初始化省
    this.fetchZoneList(0);
    // 初始化市
    this.fetchZoneList(1)
    // 初始化县
    this.fetchZoneList(2)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fetchZoneList: function (zoneIndex, callback) {
      var zoneId = this.data.zoneId[zoneIndex];
      wx.request({
        url: `${config.localhost}/userAddress/getZoneList?zoneId=${zoneId}&openId=${app.globalData.openId}`,
        success: (res) => {
          errorHandler.fail(res).success(()=>{
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
            if (callback) {
              callback(data);
            }
          });
        }
      })
    },
    columnChangeHandler: function (e) {
      var index;
      index = e.detail.value;
      if (e.detail.column == 0) {
        var regionId = this.data.multiObject[0][index].regionId;
        this.setData({ 
          ['zoneId[1]']: regionId,
          ['multiIndex[0]']: e.detail.value
        })
        this.fetchZoneList(1, (data) => {
          var regionId = data[0].regionId;
          this.setData({ ['zoneId[2]']: regionId });
          this.fetchZoneList(2);
        });
      }
      else if (e.detail.column == 1) {
        var regionId = this.data.multiObject[1][index].regionId;
        this.setData({ 
          ['zoneId[2]']: regionId,
          ['multiIndex[1]']: e.detail.value
        })
        this.fetchZoneList(2);
      }
      else if(e.detail.column == 2){
        this.setData({
          ['multiIndex[2]']: e.detail.value
        })
      }
    },
    valueChangeHandler: function (e) {
      var value = e.detail.value;
      var districtId = this.data.multiObject[2][value[2]].regionId;
      this.setData({
        province: '',
        provinceId: this.data.zoneId[1],
        cityId: this.data.zoneId[2],
        districtId: districtId,
        multiIndex: value,
        showPicker: true
      });
      // console.log(this.data.zoneId[1], this.data.zoneId[2], districtId);
      this.triggerEvent('PickerChange',{
        provinceId: this.data.zoneId[1],
        cityId: this.data.zoneId[2],
        districtId: districtId
      })
    }
  },
  
})

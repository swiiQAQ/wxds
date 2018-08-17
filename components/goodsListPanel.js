// components/goodsListPanel/goodsListPanel.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listId: {
      type: Number,
      observer: function (newVal, oldVal) {
        console.log(newVal);
      }
    },

    defaultImg: String,
    lazyloadList: Array,
    currentPageList: Array,
    lineItemHeight: Number,
    blockItemHeight: Number,
    //列表排列方式
    switchList: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  ready: function () {
    setTimeout(() => {
      this.setList()
    }, 200);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setList: function () {
      var list = app.globalData.list[this.properties.listId];
      var length = list.length;
      var blockPanelHeight = length / 2 * (this.data.blockItemHeight);
      var linePanelHeight = length * (this.data.lineItemHeight);
      
      this.setData({ 
        list: list,
        length: length,
        blockPanelHeight: blockPanelHeight,
        linePanelHeight: linePanelHeight
      });
    },
    linkGoodsDetail: function(e){
      var productCode = e.currentTarget.dataset.code;
      wx.navigateTo({
        url: `/pages/goodsDetail/goodsDetail?productCode=${productCode}`,
      })
    }
  }

})

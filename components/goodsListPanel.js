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
    itemHeight: Number
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
      this.setData({ list: list });
      var length = list.length;
      var panelHeight = length / 2 * (this.data.itemHeight);
      this.setData({ panelHeight : panelHeight});
    }
  }

})

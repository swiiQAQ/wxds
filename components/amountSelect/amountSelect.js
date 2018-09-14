// components/amount-select.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['.decrease', '.increase'],
  properties: {
    stockNum: {
      type: Number,
      observer: function(newVal) {
        if (this.data.amount > newVal) {
          this.setData({
            amount: newVal
          });
        }
      }
    },
    amount: {
      type: Number,
      observer: function(newVal) {
        this.setData({
          amount: newVal
        })
      }

    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    increase: function() {
      var amount = Number(this.data.amount);
      if (this.properties.stockNum) {
        if (amount < this.properties.stockNum) {
          this.setData({
            amount: amount + 1
          });
          this.triggerEvent('AmountChange', {
            amount: amount + 1
          });
        } else {
          wx.showToast({
            title: '不可超过数量',
            icon: 'none'
          })
          this.setData({
            amount: this.properties.stockNum
          });
          this.triggerEvent('AmountChange', {
            amount: this.properties.stockNum
          });
        }
      }
    },
    decrease: function() {
      if (this.properties.stockNum) {
        var amount = this.data.amount;
        if (amount > 1) {
          this.setData({
            amount: amount - 1
          });
          this.triggerEvent('AmountChange', {
            amount: amount - 1
          })
        }
      }
    },
    numLimit: function(e) {
      var value = e.detail.value;
      if (this.properties.stockNum) {
        if (value < 1) {
          wx.showToast({
            title: '数量不可少于1',
            icon: 'none'
          })
          this.setData({
            amount: 1
          });
          this.triggerEvent('AmountChange', {
            amount: 1
          });
        } else if (value < this.properties.stockNum) {
          this.setData({
            amount: value
          });
          this.triggerEvent('AmountChange', {
            amount: value
          });
        } else {
          wx.showToast({
            title: '不可超过数量',
            icon: 'none'
          })
          this.setData({
            amount: this.properties.stockNum
          });
          this.triggerEvent('AmountChange', {
            amount: this.properties.stockNum
          });
        }
      }
      else{
        this.triggerEvent('AmountChange', {
          amount: value
        });
      }
    }
  }
})
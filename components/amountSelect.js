// components/amount-select.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['.decrease','.increase'],
  properties: {
    stockNum: {
      type: Number,
      observer: function(newVal){
        if(this.data.amount>newVal){
          this.setData({ amount: newVal});
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    amount: '1'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    increase: function(){
      var amount = Number(this.data.amount);
      if(amount<this.properties.stockNum){
        this.setData({amount : amount + 1})
      }
      else{
        wx.showToast({
          title: '不可超过数量',
          icon: 'none'
        })
        this.setData({
          amount: this.properties.stockNum
        })
      }
    },
    decrease: function(){
      var amount = this.data.amount;
      if(amount> 1){
        this.setData({ amount : amount-1})
      }
    },
    numLimit: function(){
      
    }
  }
})

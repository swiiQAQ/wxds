// pages/accountSetting/accountSetting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  unlockModal: function(){
    wx.showModal({
      title: '是否解除手机绑定？',
      content: '请尽快绑定新手机',
      confirmText: '解除绑定',
      cancelText: '不解除',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/phoneBinding/phoneBinding',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  moneyModal:function(){
    wx.showModal({
      title: '确认退还保证金？',
      content: '保证金退还后您将无法再进销商品，保证金将在财务审核中，X个工作日后退还，具体以到账时间为准。',
      confirmText: '退保证金',
      cancelText: '暂时不退',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
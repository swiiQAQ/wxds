// pages/sort/sort.js
var {config,mock} = require('../../utils/config.js');
var { setRedDot,errorHandler } = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //一级分类结构
    firstCategory: '',
    // 一级分类index
    firstCateIndex: 0,
    //二级分类当前id
    secondCateId: '',
    // 二级分类结构
    secondCategory: []
  },    


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: app.globalData.windowHeightWithBar - 90 / config.dpi
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.request({
      url: `${config.localhost}/category/index?openId=${app.globalData.openId}`,
      success: res => {
        errorHandler.fail(res).success(()=>{
          this.setData({
            firstCategory: res.data.data,
            secondCateId: res.data.data[0].id
          });
          this.fetchSecondCategory(res.data.data[0].id);
        })
      }
    })
    // this.setData({ 
    //   firstCategory: mock.firstCategory.data,
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setRedDot(app);
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
  fetchSecondCategory: function (id,index) {
    index = index ? index : 0;
    var storageData = this.data.secondCategory[index]   
    if(!storageData){
      wx.request({
        url: `${config.localhost}/category/getChildren?categoryId=${id}&openId=${app.globalData.openId}`,
        success: (res)=>{
          errorHandler.fail(res).success(()=>{
            var dataName = `secondCategory[${index}]`;
            this.setData({
              [dataName]: res.data.data.children,
            });
          })
        }
      })
    } 
    
    // var secondCategoryInit = mock.secondCategory;
   
    else{
      
    }
  },
  changeSecondCategory:function(e){
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    this.setData({ 
      secondCateId: id,
      firstCateIndex: index
    });
    this.fetchSecondCategory(id,index);
  },
  linkGoodsList: function(e){
    var id = e.currentTarget.dataset.id;
    var productCategoryId = e.currentTarget.dataset.productcategoryid;
    var catename = e.target.dataset.catename;
    wx.navigateTo({
      url: `/pages/goodsList/goodsList?id=${id}&productCategoryId=${productCategoryId}&cateName=${catename}`,
    })
  },
})
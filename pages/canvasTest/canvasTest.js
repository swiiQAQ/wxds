// pages/canvasTest/canvasTest.js
var {config} = require('../../utils/config.js');
var app = getApp();
var { multiDownload } = require('../../utils/multiDownload.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选中的图片
    selectedList: [],
    selectedAmountList:[10,20,30,40,50],
    selectedAmountIndex:2,
    addPrice: 30
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var price = options.price;
    var productCode = options.productCode;
    var galleryList;
    wx.request({
      url: `${config.localhost}/product/getProductImgs?productCode=${productCode}&openId=${app.globalData.openId}`,
      success: (res)=>{
        this.setData({ 
          defaultGallery: res.data.data.imgUrls,
          productName: res.data.data.productName,
          sellerPoint: res.data.data.sellerPoint,
          sizeList: res.data.data.sizeList,
          price: price
        });

        
      }
    })
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
  saveImg: function(){
    var dpi = config.dpi;
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: 555/dpi,
      height: 910/dpi,
      canvasId: 'myCanvas',
      destWidth: 555*2,
      destHeight: 910*2,
      success(res){
        var temp = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: temp,
          success: ()=>{
            wx.showToast({
              title: '保存成功',
            })
            this.setData({ maskShow: false})
          }
        })
      }
    }, this)
  },
  selectImg:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.selectedList;
    var exist = false;
    list.forEach((item, id)=>{
      if(item == index){
        list.splice(id,1);
        exist = true;
        this.setData({ selectedList: list});
      }
    })
    if(list.length<6&&!exist){
      list.push(index);
      this.setData({ selectedList: list});
    }
  },
  clearSelectedHandler: function(){
    this.setData({ selectedList: []});
  },
  createCanvas: function(){
    var selectedList = this.data.selectedList;
    if(selectedList.length!==6){
      wx.showToast({
        title: '请选择6张图片',
        icon: 'none'
      });
      return;
    }
    var galleryList=[];
    var dpi = config.dpi;
    var length = selectedList.length;
    if (length==6){
      // 将数组映射成代表图片的数组
      selectedList.forEach((item) => {
        galleryList.push(this.data.defaultGallery[item]);
      })
      // this.setData({ height: Math.ceil(length / 2) * 120 });
      multiDownload(galleryList, (tempList)=>{
        const ctx = wx.createCanvasContext('myCanvas');
        ctx.clearRect(0, 0, 0, 0);
        tempList.forEach((item,index)=>{
          var size = index % 2;
          var num = Math.ceil(index / 2); 
          if(size == 0){
            ctx.drawImage(tempList[index], 50/dpi, (50+236*num)/dpi, 220/dpi, 220/dpi)
          }
          else if(size == 1){
            ctx.drawImage(tempList[index], 286/dpi, (50 + 236 * (num - 1))/dpi, 220/dpi, 220/dpi)
          };
          ctx.setTextAlign('center');
          ctx.setFontSize(20/dpi);
          ctx.fillText(this.data.productName, 278/dpi,780/dpi);
          ctx.setFontSize(16/dpi);
          ctx.setFillStyle('#454545');
          ctx.fillText(this.data.sellerPoint,278/dpi,820/dpi,450/dpi)
          ctx.setFontSize(24/dpi);
          ctx.fillText('￥' + Number(this.data.price)+this.data.addPrice, 278 / dpi, 880/dpi)
        })
        ctx.draw();
      });
      this.setData({ maskShow: true });
    }    
  },
  editHandler:function(){
    this.setData({ 
      editPanel: true
    });
  },
  closeMask:function(){
    this.setData({ 
      maskShow: false,
      editPanel: false
    });
  },
  selectAmountHandler:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({ 
      selectedAmountIndex:index,
      addPrice: this.data.selectedAmountList[index]
    });
  },
  inputHandler:function(e){
    var value = e.detail.value;
    this.setData({ 
      addPrice: value,
      selectedAmountIndex: 5
    });
  },
  confirmHandler:function(){
    this.setData({ editPanel: false})
  }
})
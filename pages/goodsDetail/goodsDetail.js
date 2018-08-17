// pages/goodsDetail/goodsDetail.js
var {config} = require("../../utils/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品主图当前图片index
    galleryIndex: 0,
    //手机高度
    screenHeight: config.screenHeight,
    //图文详情
    tuwen: '',
    //傻瓜品信息
    goodsAttrs: '',
    //品牌介绍
    brandInfo: '',
    //编辑推荐
    salePoint: '',
    //尺码表
    sizeTabel: '',
    //测试方法
    sizePicture: '',
    //选择尺码弹窗
    mask: false,
    //尺码颜色无库存
    noStockArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var productCode = options.productCode;
    wx.request({
      // url: `${config.localhost}/wxfx.mobileServer/product/getProductInfo?productCode=${productCode}&openId=${config.testOpenId}`,
      url: `${config.localhost}/wxfx.mobileServer/product/getProductInfo?productCode=${productCode}&openId=${config.testOpenId}`,
      success: res =>{
        console.log(res);
        var data = res.data.data;
        this.setData({
          galleryList: data.galleryList,
          brandName: data.brandName,
          productName: data.productName,
          marketPrice: data.marketPrice,
          salesPrice: data.maxSalesPrice,
          sizeList: data.sizesList,
          colorList: data.colorList,
          skuInfo: data.skuInfo,
          saleAttrList: data.saleAttrList
        })
        this.setPreviewImg(data.colorList);
      }
    });
    wx.request({
      url: `${config.localhost}/wxfx.mobileServer/product/getProductDescription?productCode=${productCode}&openId=${config.testOpenId}`,
      success: res =>{
        var data = res.data.data;
        this.setData({ 
          tuwen: data.images,
          goodsAttrs: data.goodsAttrs,
          brandInfo: data.brandInfo,
          salePoint: data.salePoint,
          sizeTable: JSON.parse(data.sizeTable),
          sizePicture: data.sizePicture
        })
        console.log(JSON.parse(data.sizeTable));
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
  //商品封面图片轮播滑动事件
  changeGalleryIndex: function (e) {
    var newIndex = e.detail.current;
    this.setData({ galleryIndex: newIndex });
  },
  //展开弹窗
  showMask: function(){
    this.setData({ mask: true});
  },

  setPreviewImg: function (colorList) {
    var previewImg = [];
    colorList.forEach((value, index) => {
      previewImg.push('http://img.banggo.com' + value.colorImage);
    })
    this.setData({ previewImg: previewImg });
  },
  //预览图片
  previewImg: function (e) {
    wx.previewImage({
      current: this.data.previewImg[this.data.colorId],
      urls: this.data.previewImg,
    })
  },
  //选择尺码
  selectSize: function (e) {
    var sizeId = e.target.dataset.id;
    var sizeName = e.target.dataset.sizename;
    var sizeCode = e.target.dataset.sizecode;
    if (sizeId !== this.data.sizeId) {
      this.setData({
        sizeId: sizeId,
        sizeName: sizeName,
        sizeCode: sizeCode
      });
    }
    else {
      this.setData({
        sizeId: '',
        sizeName: '',
        sizeCode: '',
      })
    }
    this.stockFilter();

  },

  //选择颜色
  selectColor: function (e) {
    var colorId = e.target.dataset.id;
    var colorName = e.target.dataset.colorname;
    var colorCode = e.target.dataset.colorcode;
    var colorImage = e.target.dataset.image;
    if (colorId !== this.data.colorId) {
      this.setData({
        colorId: colorId,
        colorName: colorName,
        colorCode: colorCode,
        colorImage: 'http://pic.banggo.com' + colorImage,
      });
    }
    else {
      this.setData({
        colorId: '',
        colorName: '',
        colorCode: '',
        colorImage: ''
      })
    }
    this.stockFilter();
  },

  //库存双向筛选
  stockFilter: function () {
    var _this = this;
    var skuInfo = this.data.skuInfo;
    var colorCode = this.data.colorCode;
    var sizeCode = this.data.sizeCode;
    var saleAttrList = this.data.saleAttrList
    var arr = [];
    var attr = sizeCode ? 'saleAttr2ValueCode' : 'saleAttr1ValueCode';
    var another = sizeCode ? 'saleAttr1ValueCode' : 'saleAttr2ValueCode';
    if(sizeCode){
      saleAttrList.saleAttr2List.forEach((item,index)=>{
        if (item.saleAttr2ValueCode==sizeCode){
          this.setData({stockNum: item.stockNum})
        }
      })
    }
    else if (colorCode){
      saleAttrList.saleAttr1List.forEach((item, index) => {
        if (item.saleAttr1ValueCode == sizeCode) {
          this.setData({ stockNum: item.stockNum })
        }
      })
    }

    skuInfo.forEach(function (skuItem, key) {
      if (((skuItem[attr] == sizeCode) || skuItem[attr] == colorCode) && (skuItem['stockNum'] == 0)) {
        arr.push(skuItem[another]);
      }
      if ((skuItem[another] == colorCode) && (skuItem['stockNum'] == 0)) {
        arr.push(skuItem[attr])
      }
      if((skuItem[attr] == sizeCode && skuItem[another] == colorCode)|| (skuItem[attr] == colorCode && skuItem[another] == sizeCode)){
        _this.setData({stockNum: skuItem.stockNum});
      }
    })
    _this.setData({
      noStockArray: arr
    })
  },
  //关闭弹窗
  closeMask: function () {
    this.setData({ mask: false });
    this.setData({ canScrollY: true });
  },
})
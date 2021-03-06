// pages/goodsDetail/goodsDetail.js
var { config } = require("../../utils/config.js");
var { validateRequired } = require('../../utils/validate.js');
var { showToast, errorHandler, callCustomService } = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品主图当前图片index
    galleryIndex: 0,
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
    amount: 1,
    scrollHeight: '',
    picHost: config.picHost,
    canScrollY: true
  },
  onShareAppMessage:function(res){
    return{
      imageUrl: 'http://pic.banggo.com/sources/images/goods/MC/519888/519888_00.jpg?x-oss-process=image/resize,m_fill,w_300,h_410'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      scrollHeight: app.globalData.windowHeightWithoutBar - 110 / config.dpi,
    })
    var productCode = options.productCode;
    wx.request({
      url: `${config.localhost}/product/getProductInfo?productCode=${productCode}&openId=${app.globalData.openId}`,
      success: res => {
        errorHandler.fail(res).success(()=>{
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
            saleAttrList: data.saleAttrList,
            productCode: productCode
          })
          //没有库存
          if (!data.stockNum) {
            this.noStockHandler();
          }else{
            this.setPreviewImg(data.colorList);
          }
        })
      }
    });
    wx.request({
      url: `${config.localhost}/product/getProductDescription?productCode=${productCode}&openId=${app.globalData.openId}`,
      success: res => {
        errorHandler.fail(res).success(()=>{
          var data = res.data.data;
          this.setData({
            tuwen: data.images,
            goodsAttrs: data.goodsAttrs,
            brandInfo: data.brandInfo,
            salePoint: data.salePoint,
            sizeTable: JSON.parse(data.sizeTable),
            sizePicture: data.sizePicture,
            //六位码
            productSysCode: data.productSysCode,
            //分类
            categories: data.categories
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({ mask: false})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //商品封面图片轮播滑动事件
  changeGalleryIndex: function(e) {
    var newIndex = e.detail.current;
    this.setData({
      galleryIndex: newIndex
    });
  },
  //展开弹窗
  showMask: function(e) {
    // if(this.data.soldout){
    //   return;
    // }
    var type = e.currentTarget.dataset.type;
    this.setData({ type: '' });
    if(type){
      this.setData({ type: 'download'});
    }
    this.setData({
      mask: true,
      flashFlag: false,
      canScrollY: false,
    });
  },

  setPreviewImg: function(colorList) {
    var previewImg = [];
    colorList.forEach((value, index) => {
      previewImg.push( config.picHost + value.colorImage);
    })
    this.setData({
      previewImg: previewImg
    });
  },
  //预览图片
  previewImg: function(e) {
    wx.previewImage({
      current: this.data.previewImg[this.data.colorId],
      urls: this.data.previewImg,
    })
  },
  //选择尺码
  selectSize: function(e) {
    var sizeId = e.target.dataset.id;
    var sizeName = e.target.dataset.sizename;
    var sizeCode = e.target.dataset.sizecode;
    if (sizeId !== this.data.sizeId) {
      this.setData({
        sizeId: sizeId,
        sizeName: sizeName,
        sizeCode: sizeCode
      });
    } else {
      this.setData({
        sizeId: '',
        sizeName: '',
        sizeCode: '',
      })
    }
    this.stockFilter();

  },

  //选择颜色
  selectColor: function(e) {
    var colorId = e.target.dataset.id;
    var colorName = e.target.dataset.colorname;
    var colorCode = e.target.dataset.colorcode;
    var colorImage = e.target.dataset.image;
    if (colorId !== this.data.colorId) {
      this.setData({
        colorId: colorId,
        colorName: colorName,
        colorCode: colorCode,
        colorImage: config.picHost + colorImage,
      });
    } else {
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
  stockFilter: function() {
    var _this = this;
    var skuInfo = this.data.skuInfo;
    var colorCode = this.data.colorCode;
    var sizeCode = this.data.sizeCode;
    var saleAttrList = this.data.saleAttrList
    var arr = [];
    var attr = sizeCode ? 'saleAttr2ValueCode' : 'saleAttr1ValueCode';
    var another = sizeCode ? 'saleAttr1ValueCode' : 'saleAttr2ValueCode';
    if (sizeCode) {
      saleAttrList.saleAttr2List.forEach((item, index) => {
        if (item.saleAttr2ValueCode == sizeCode) {
          this.setData({
            stockNum: item.stockNum
          })
        }
      })
    } else if (colorCode) {
      saleAttrList.saleAttr1List.forEach((item, index) => {
        if (item.saleAttr1ValueCode == sizeCode) {
          this.setData({
            stockNum: item.stockNum
          })
        }
      })
    }

    skuInfo.forEach((skuItem, key)=> {
      if (((skuItem[attr] == sizeCode) || skuItem[attr] == colorCode) && (skuItem['stockNum'] == 0)) {
        arr.push(skuItem[another]);
      }
      if ((skuItem[another] == colorCode) && (skuItem['stockNum'] == 0)) {
        arr.push(skuItem[attr])
      }
      if ((skuItem[attr] == sizeCode && skuItem[another] == colorCode) || (skuItem[attr] == colorCode && skuItem[another] == sizeCode)) {
        if(this.data.amount> skuItem.stockNum){
          this.setData({ amount: skuItem.stockNum});
        }
        this.setData({
          stockNum: skuItem.stockNum
        });
      }
    })
    _this.setData({
      noStockArray: arr
    })
  },
  //关闭弹窗
  closeMask: function() {
    this.setData({
      mask: false,
      canScrollY: true,
    });
  },
  //确认操作
  cartHandler: function() {
    //如果是立即购买，跳转订单页
    if(this.data.flashFlag){
      this.cartInterface().then(data => {
        this.flashCart(data);
      })
    }
    //加入购物车
    else{
      this.cartInterface().then(data => {
        this.addProduct(data);
      })
    }
  },
  //封装购物车数据
  cartInterface: function() {
    return new Promise((resolve,reject)=>{
      var result = validateRequired(['colorCode', 'sizeCode'], this);
      if (result == true) {
        var goods = {
          productSysCode: this.data.productCode,
          saleAttr1ValueCode: this.data.colorCode,
          saleAttr2ValueCode: this.data.sizeCode
        }
        goods = JSON.stringify(goods);
        var data = {
          goods: goods,
          count: this.data.amount,
          openId: app.globalData.openId
        }
        return resolve(data);
      } else {
        showToast(result)
      }
    })
  },
  //加入购物车
  addProduct: function(data){
    wx.request({
      url: `${config.localhost}/cart/addProduct`,
      data: data,
      success: (res) => {
        errorHandler.fail(res).success(()=>{
          this.setData({
            mask: false
          });
          showToast(res.data.message);
          wx.request({
            url: `${config.localhost}/cart/getCartGoodsNum?openId=${app.globalData.openId}`,
            success: (res) => {
              app.globalData.redDot = res.data.data;
            }
          })
        })
      },
    })
  },
  //数量选择
  amountChange: function(e) {
    // console.log(e);
    var amount = e.detail.amount;
    this.setData({
      amount: amount
    });
  },
  //立即购买按钮
  buyNow: function() {
    if(this.data.soldout){
      return;
    }
    var colorCode = this.data.colorCode;
    var sizeCode = this.data.sizeCode;
    if(sizeCode&&colorCode){
      this.cartInterface().then(data=>{
        this.flashCart(data);
      })
    }else{
      this.setData({
        canScrollY: false,
        mask: true,
        flashFlag: true
      });
    }
  },
  //立即结算
  flashCart: function(data){
    wx.request({
      url: `${config.localhost}/cart/flashCart`,
      data: data,
      success: res => {
        errorHandler.fail(res).success(()=>{
          wx.navigateTo({
            url: '/pages/createOrder/createOrder?flashFlag=true',
          })
        })
      }
    })
  },
  //售罄商品处理
  noStockHandler: function(){
    this.setData({
      soldout: true
    })
  },
  callPhone: function(){
    callCustomService();
  },
  tuwenLink: function(e){
    this.setData({ scrollId: e.target.dataset.scrollid});
  },
  drawCanvas: function(){
    wx.navigateTo({
      url: '/pages/canvasTest/canvasTest?data='+this.data.productCode,
    })
  },
  // 拼图下载
  download: function(){
    wx.navigateTo({
      url: `/pages/canvasTest/canvasTest?price=${this.data.salesPrice}&productCode=${this.data.productCode}`,
    })
  },
})
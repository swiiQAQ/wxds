var app = getApp();
var { config } = require("../../utils/config.js");
var { setRedDot,errorHandler } = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  /**
  * 页面的初始数据
  */
  data: {
    //商品列表
    list: [],
    complexFold: true,
    complexText: '综合',
    maskShow: false,

    //二级页面数据
    filterPanel2: {
      name: '',
      value: ''
    },
    //筛选options
    filterOptions: {
      price: '',
      gender: '',
      season: '',
      situation: '',
      series: '',
      color: '',
      size: '',
      fabrics: '',
    },
    //默认图片
    defaultImg: 'http://pic.bonwego.com/sources/images/common/default.png',
    //
    lazyloadList: [],
    //一页有多少条数据
    pageSize: '',
    //当前页数
    currentPage: 1,
    //排序index
    complexIndex: 0,
    //商品单条高度(rpx单位)
    blockItemHeight: 547,
    lineItemHeight: 220,
    //价格，新品，有货，关键字
    priceFilter: '',
    price: '',
    xinpin: true,
    searchText: '',
    hasStock: '',
    refresh: false,
    isScrollHandler: true,
    // 状态是为了刷新组件，通知组件回顶，全局变量是为了和状态比较，变化后再更新状态，从而删减组件
    currentPageList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取减去tabbar之后的可视高度
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.windowHeightWithBar = res.windowHeight;
      },
    })

    var _this = this;
    app.globalData.currentPageList = [0, 1];
    this.setData({ currentPageList: app.globalData.currentPageList });
    this.fetchGoodsList(1,  (data)=> {
      this.initLazyloadList(data, this);
    });
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
    setRedDot(app);
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
  fetchGoodsList: function (pageNum, callback) {
    pageNum = pageNum ? pageNum : 1;
    var hasStock = this.data.hasStock == '' ? '' : Number(this.data.hasStock);
    var price = this.data.price == '' ? '' : Number(this.data.price);
    wx.request({
      url: `${config.localhost}/product/getProductList`,
      data: {
        openId: app.globalData.openId,
        pageNo: pageNum,
        hasStock: hasStock,
        xinpin: this.data.xinpin == '' ? '' : Number(this.data.xinpin),
        searchText: this.data.searchText,
        price: price
      },
      success:  (res)=>{
        errorHandler.fail(res).success(()=>{
          if (res.data.data.results.length||res.data.data.pageNo!==1) {
            this.setData({
              isScrollHandler: true,
            });
            if(res.data.data.results.length < res.data.data.pageSize){
              callback(res.data.data)
              this.setData({ isScrollHandler: false})
            }
            else{
              callback(res.data.data);
            }
          }
          else {
            app.globalData.list = [];
          }
        })
      }
    })
  },
  complexHandler: function () {
    var complexFold = this.data.complexFold;
    this.setData({ complexFold: !complexFold });
  },
  changeComplex: function (e) {
    var text = e.target.dataset.text;
    var index = e.target.dataset.index;
    this.setData({
      complexText: text,
      complexFold: true,
      complexIndex: index
    });
  },

  //滚动事件
  scrollHandler: function (e) {
    var scrollTop = e.detail.scrollTop;
    var size = this.data.pageSize;
    var oldPageList = app.globalData.currentPageList;
    if (!this.data.switchList) {
      var itemHeight = this.data.blockItemHeight;
      var calc = Math.floor((scrollTop + itemHeight * 2 / config.dpi) / (itemHeight / config.dpi) * 2) + 1;
      var currentPageList = [Math.floor(calc / size - 1), Math.floor(calc / size)];
    }
    else {
      var itemHeight = this.data.lineItemHeight;
      var calc = Math.floor((scrollTop + app.globalData.windowHeightWithBar ) / (itemHeight / config.dpi));
      // console.log(calc);
      var currentPageList = [Math.floor(calc / size - 1), Math.floor(calc / size)];
    }

    if (calc > size && currentPageList.toString() !== oldPageList.toString()) {
      this.setData({ currentPageList: currentPageList });
      app.globalData.currentPageList = currentPageList;
    }
    // console.log(scrollTop);
    // console.log(calc);
    var arr = this.data.lazyloadList;
    if (arr[calc] !== true) {
      for (var i = 0; i < arr.length; i++) {
        if (i < calc) {
          arr[i] = true;
        } else {
          break;
        }
      }
      this.setData({ lazyloadList: arr });
    }
  },
  //下拉刷新
  scrolltoLowerHandler: function () {
    var size = this.data.pageSize;
    var currentPage = this.data.currentPage;
    var _this = this;
    var list = app.globalData.list;
    var arr = this.data.lazyloadList;
    var newArr = [];
    for (var i = 0; i < size; i++) {
      newArr[i] = false;
    }
    this.fetchGoodsList(currentPage + 1, function (data) {
      var newList = data.results;
      list.push(newList);
      app.globalData.list = list;
      _this.setData({
        lazyloadList: arr.concat(newArr),
        currentPage: currentPage + 1
      });
    });
  },
  foldPanel: function () {
    this.setData({
      filterPanel: false,
    });
  },
  //切换商品列表展示
  switchList: function () {
    var switchList = this.data.switchList;
    app.globalData.currentPageList = [0, 1];
    this.setData({
      currentPageList: [0,1],
      switchList: !switchList,
      scrollTop: 0
    });
  },
  //切换价格排序
  priceFilter: function () {
    var _this = this;
    var priceFilter = this.data.priceFilter;
    priceFilter = (priceFilter == 'top' ? 'bottom' : 'top');
    this.setData({
      priceFilter: priceFilter,
      price: (priceFilter == 'top' ? 1 : 2),
      xinpin: ''
    });
    this.fetchSort();
  },
  //切换新品排序
  xinpin: function () {
    var _this = this;

    this.setData({ xinpin: !this.data.xinpin });
    if (this.data.xinpin == true) {
      this.setData({
        priceFilter: '',
        price: ''
      });
    };
    this.fetchSort();
  },
  //切换有货排序
  youhuo: function () {
    var _this = this;
    this.setData({ hasStock: !this.data.hasStock });
    this.fetchSort();
  },
  fetchSort: function () {
    app.globalData.list = [];
    this.fetchGoodsList(1, (data) => {
      this.initLazyloadList(data, this);
      this.clearProperties();
    });
  },
  //初始化lazyloadList
  initLazyloadList: function (data, _this) {
    //创造一个每个值都为false，长度和list一样的数组
    var length = data.pageSize;
    _this.setData({ pageSize: length });
    var arr = [];
    for (var i = 0; i < length; i++) {
      if (i < 5) {
        arr[i] = true
      }
      else {
        arr[i] = false;
      }
    }
    app.globalData.list = [data.results];

    _this.setData({
      lazyloadList: arr,
    });
  },
  //每进行一次刷新商品列表，各项属性清空
  clearProperties: function () {
    app.globalData.currentPageList = [0, 1];
    this.setData({
      refresh: !this.data.refresh,
      scrollTop: 0,
      currentPageList: [0, 1],
      currentPage: 1
    });
  }
})


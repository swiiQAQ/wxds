// pages/goodsList/goodsList.js
var {config} = require('../../utils/config.js');
var app = getApp();
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
    defaultImg: 'http://s.banggo.com/pub7/images/mbshop/common/banggo.png',
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
    3: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var productCategoryId = options.productCategoryId;
    this.setData({
      id: id,
      productCategoryId: productCategoryId
    })
    var _this = this;
    // if (app.globalData.currentPageList[0] !== 0) {
      app.globalData.currentPageList = [0, 1];
    // }
    this.setData({ currentPageList: app.globalData.currentPageList });
    this.fetchGoodsList( 1, function (data) {
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
  fetchGoodsList: function ( pageNum, callback) {
    var id = this.data.id;
    var productCategoryId = this.data.productCategoryId;
    pageNum = pageNum ? pageNum : 1;
    wx.request({
      // url: 'http://m.banggo.com/searchbrand/get-search-goods/a_a_a_MC_a_a_a_a_a_a_a_a.shtml?ts=&discountRate=a&controller=searchBrand&suffix=&word=&currentPage=' + pageNum,
      url: `${config.localhost}/wxfx.mobileServer/product/getProductList?id=${id}&productCategoryId=${productCategoryId}&openId=${config.testOpenId}&pageNo=${pageNum}`,
      success: function (res) {
        console.log(res);
        if(res.data.data.results.length){
          callback(res.data.data);
        }
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
  filterUnfold: function () {
    var _this = this;
    this.setData({ filterPanel: true });
    wx.request({
      url: 'http://m.banggo.com/searchbrand/get-filter-info/a_a_a_MC_a_a_a_a_a_a_a_a.shtml?ts=&discountRate=a&controller=searchBrand&suffix=&word=&',
      success: function (res) {
        var othersList = res.data.data.others;
        var category = res.data.data.cate;
        _this.setData({
          category: category,
          othersList: othersList
        })
      }
    })
  },
  //滚动事件
  scrollHandler: function (e) {
    var scrollTop = e.detail.scrollTop;
    var size = this.data.pageSize;
    var oldPageList = app.globalData.currentPageList;
    if(!this.data.switchList){
      var itemHeight = this.data.blockItemHeight;
      var calc = Math.floor((scrollTop + itemHeight * 2 / config.dpi) / (itemHeight / config.dpi) * 2) + 1;
      var currentPageList = [Math.floor(calc / size - 1), Math.floor(calc / size)];
    }
    else{
      var itemHeight = this.data.lineItemHeight;
      var calc = Math.floor((scrollTop + config.screenHeight)/ (itemHeight/config.dpi));
      console.log(calc);
      var currentPageList = [Math.floor(calc / size - 1), Math.floor(calc / size)];
    }
    
    if (calc > size && currentPageList.toString() !== oldPageList.toString()) {
      this.setData({ currentPageList: currentPageList });
      app.globalData.currentPageList = currentPageList;
    }
    // console.log(scrollTop);
    // console.log(calc);
    var arr = this.data.lazyloadList;
    if (arr[calc] == false) {
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
  switchList:function(){
    var switchList = this.data.switchList;
    this.setData({ 
      switchList: !switchList,
      scrollTop: 0
    });
  }
})
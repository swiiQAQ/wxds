// pages/goodsList/goodsList.js
var {config} = require('../../utils/config.js');
var { errorHandler } = require('../../utils/util.js');
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
    list: false,
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
    searchText:'',
    hasStock: '',
    id: '',
    productCategoryId: '',
    //强制组件刷新，list存在全局变量中，改变后组件不刷新
    refresh: false,
    //商品列表是否有结果
    listResult: false,
    //如果一次性拉取小于pagesize，下滑不再拉取数据
    isScrollHandler: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.currentPageList = [0, 1];
    this.setData({ currentPageList: app.globalData.currentPageList });
    if(options.id){
      var id = options.id;
      var productCategoryId = options.productCategoryId;
      var cateName = options.cateName;
      this.setData({
        id: id,
        productCategoryId: productCategoryId,
        cateName: cateName
      })
    }
    if(options.searchText){
      this.setData({ searchText: options.searchText});
    }
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  //返回页面 避免搜索多层回退问题
  onUnload: function(){
    var pages = getCurrentPages();
    wx.redirectTo({
      url: '/'+pages[0].__route__,
    })
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
    var hasStock = this.data.hasStock == ''?'':Number(this.data.hasStock);
    var price = this.data.price == '' ? '' : Number(this.data.price);
    wx.request({
      url: `${config.localhost}/product/getProductList`,
      data:{
        id: id,
        productCategoryId: productCategoryId,
        openId: app.globalData.openId,
        pageNo: pageNum,
        hasStock: hasStock,
        xinpin: this.data.xinpin == '' ? '' : Number(this.data.xinpin),
        searchText: this.data.searchText,
        price: price,
        rows: 20
      },
      success:  (res)=> {
        errorHandler.fail(res).success(()=>{
          //如果是此分页存在数据或者曾经存在数据都可以排除掉一开始的查询无结果
          if (res.data.data.results.length||res.data.data.pageNo!==1) {
            this.setData({ 
              listResult: true,
              scrollY: true,
            });
            //如果此分页的数据小于pagesize代表是最后一页，或者这一页没有数据，不再创造节点并且阻止下拉事件
            if(res.data.data.results.length<this.data.pageSize){ 
              callback(res.data.data);
              this.setData({ isScrollHandler: false});
            }
            else {
              callback(res.data.data);
            }
          }
          else {
            app.globalData.list = [];
            //商品列表在有商品的时候滚到下面再进行查询无结果时，可以往下滚动一段距离，scrollY禁止滚动，保持一屏
            this.setData({ 
              refresh: !this.data.refresh,
              listResult: false,
              scrollTop: 0,
              scrollY: false
            })
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
  // 筛选展开
  // filterUnfold: function () {
  //   var _this = this;
  //   this.setData({ filterPanel: true });
  //   wx.request({
  //     url: 'http://m.banggo.com/searchbrand/get-filter-info/a_a_a_MC_a_a_a_a_a_a_a_a.shtml?ts=&discountRate=a&controller=searchBrand&suffix=&word=&',
  //     success: function (res) {
  //       var othersList = res.data.data.others;
  //       var category = res.data.data.cate;
  //       _this.setData({
  //         category: category,
  //         othersList: othersList
  //       })
  //     }
  //   })
  // },
  //滚动事件
  scrollHandler: function (e) {
    var scrollTop = e.detail.scrollTop;
    var size = this.data.pageSize;
    var oldPageList = app.globalData.currentPageList;
    //块状分布
    if(!this.data.switchList){
      var itemHeight = this.data.blockItemHeight;
      var calc = Math.floor((scrollTop + itemHeight * 2 / config.dpi) / (itemHeight / config.dpi) * 2)+1;
      var currentPageList = [Math.floor(calc / size - 1), Math.floor(calc / size)];
    }
    // 条状分布
    else{
      var itemHeight = this.data.lineItemHeight;
      var calc = Math.floor((scrollTop + app.globalData.windowHeightWithoutBar)/ (itemHeight/config.dpi));
      // console.log(calc);
      var currentPageList = [Math.floor(calc / size - 1), Math.floor(calc / size)];
    }
    
    if (calc > size && currentPageList.toString() !== oldPageList.toString()) {
      this.setData({ currentPageList: currentPageList });
      app.globalData.currentPageList = currentPageList;
    }
    var arr = this.data.lazyloadList;
    //避免重复赋值
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
    var list = app.globalData.list;
    var arr = this.data.lazyloadList;
    var newArr = [];
    for (var i = 0; i < size; i++) {
      newArr[i] = false;
    }
    this.fetchGoodsList(currentPage + 1,  (data)=> {
      var newList = data.results;
      list.push(newList);
      app.globalData.list = list;
      this.setData({
        lazyloadList: arr.concat(newArr),
        currentPage: currentPage + 1
      });
    });
  },
  // foldPanel: function () {
  //   this.setData({
  //     filterPanel: false,
  //   });
  // },
  //初始化lazyloadList
  initLazyloadList:function(data,_this){
    //创造一个每个值都为false，长度和list一样的数组
    var length = data.pageSize;
    _this.setData({ pageSize: length });
    var arr = [];
    for (var i = 0; i < length; i++) {
      //第一版前四个先展示
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
  //切换商品列表展示
  switchList:function(){
    var switchList = this.data.switchList;
    app.globalData.currentPageList = [0, 1];
    this.setData({ 
      currentPageList: [0,1],
      switchList: !switchList,
      scrollTop: 0
    });
  },
  //切换价格排序
  priceFilter:function(){
    var priceFilter = this.data.priceFilter;
    priceFilter = (priceFilter == 'top'? 'bottom': 'top');
    this.setData({ 
      priceFilter: priceFilter,
      price: (priceFilter == 'top' ? 1 : 2),
      xinpin: ''
    });
    this.fetchSort();
  },
  //切换新品排序
  xinpin: function(){
    this.setData({ xinpin: !this.data.xinpin});
    if( this.data.xinpin == true){
      this.setData({ 
        priceFilter: '',
        price: ''
      });
    };
    this.fetchSort();
  },
  //切换有货排序
  youhuo: function(){
    this.setData({ hasStock: !this.data.hasStock});
    this.fetchSort();
  },
  //筛选条件选中事件
  fetchSort: function(){
    app.globalData.list = [];
    this.fetchGoodsList(1, (data) => {
      this.initLazyloadList(data, this);
      this.clearProperties();
    });
  },
  //搜索框搜索事件
  searchHandler: function(e){
    var value = e.detail.value;
    this.setData({ searchText: value });
    app.globalData.list = [];
    this.fetchGoodsList(1,  (data)=>{
      
      this.initLazyloadList(data, this);
      this.clearProperties();
      
    });
  },
  inputWords: function(e){
    var words = e.detail.value;
    this.setData({ searchText: words });
  },
  clearSearch: function(){
    this.setData({ searchText: ''});
  },
  //每进行一次刷新商品列表，各项属性清空
  clearProperties: function(){
    app.globalData.currentPageList = [0, 1];
    this.setData({
      isScrollHandler: true,
      refresh: !this.data.refresh,
      scrollTop: 0,
      currentPageList: [0, 1],
      currentPage: 1
    });
  }
})
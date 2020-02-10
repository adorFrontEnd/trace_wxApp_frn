// pages/shopManage/shopManage.js
import router from '../../router/router.js';

import {
  userLogout,
  isUserLogin
} from '../../api/localStorage/login.js';
import {
  getCacheUserInfo
} from '../../api/localStorage/login.js';
import {
  picUrlPrefix
} from '../../config/http.config.js';
import {
  parseScanCode,
  commonScanCode,
  scanTraceCodeWithKey,
  scanCode
} from '../../api/wx/wxScanCode.js';
import Toast from "../../utils/toast.js";
import {
  getCacheDealerName,
  setCacheLogistics,
  getCacheLogistics
} from '../../api/localStorage/agency.js';
import {
  getShelfQuery,
  shelfOperationSingle,
  scanDetail,
  confirmationOfWriteOff,
  commodityWriteOffList
} from '../../api/shop/shop.js';
import dateUtil from '../../utils/dateUtil';
import {
  formatOrderList
} from "../../service/order/order.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: {
      hasMore: true,
      show: false,
      pageIndex: 1,
      init: true,
      size: '10'
    },
    isShowPutAway: false,
    isShowCancel: true,
    activeOrderType: 1,
    isPutAway: true,
    isSoldOut: false,
    date: dateUtil.getNowDate(),
    type: 1,
    productUniqueCode: '',
    shelfQueryList: [],
    orderTabList: [{
      orderType: 1,
      title: "上架记录"
    }, {
      orderType: 0,
      title: "下架记录"
    }],
    isShowComfirmModal: false,
    goodsDetail: null,
    writeOffLogId: null,
    commodityWriteOffList: [],
    cancelloading: {
      hasMore: true,
      show: false,
      pageIndex: 1,
      init: true,
      size: '10'
    },
    soldOutList: [],
    month: dateUtil.getNowDate()


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommodityWriteOffList(true);
  },

  onShow: function () {

    // this.getCommodityWriteOffList(true);
    let time = dateUtil.getNowDate();
    time = time.substring(0, time.length - 3);
    this.setData({
      month: time
    })

  },
  /**切换************************************************************************************************************/
  tabOrder(e) {
    let activeOrderType = e.currentTarget.dataset.ordertype;
    this.setData({
      activeOrderType
    })
    this.getShelfQuery();
  },
  // 点击核销
  clickCancel() {
    this.setData({
      isShowCancel: true,
      isShowPutAway: false
    })
  },
  // 点击上架
  clickPutAway() {
    this.setData({
      isShowPutAway: true,
      isShowCancel: false
    })
    this.getShelfQuery();
  },

  // 扫描上架
  scanCodeShelf() {
    scanTraceCodeWithKey()
      .then(data => {
        if (data) {
          this.setData({
            productUniqueCode: data.code
          })
        }
        let {
          productUniqueCode
        } = this.data;
        return shelfOperationSingle({
          productUniqueCode
        })
          .then((res) => {
            Toast('上架成功!');
            this.getShelfQuery(false);
          })
      })
      .catch(() => {
        Toast("请扫描正确的二维码！")
      })
  },
  // 扫描核销
  scanCancel() {
    scanCode()
      .then(data => {
        let writeOffLogId = data.result;
        this.setData({
          writeOffLogId
        })
        return scanDetail({
          writeOffLogId
        })
          .then(res => {
            if (res) {
              this.setData({
                goodsDetail: res,
                isShowComfirmModal: true
              })
              this.getCommodityWriteOffList();
            }
          })
      })
    // .catch(() => {
    //   Toast('请扫描正确的二维码！')
    // })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    }, () => {
      this.getCommodityWriteOffList();
    })

  },
  bindMonthChange(e) {
    this.setData({
      month: e.detail.value
    }, () => {
      this.getShelfQuery();
    })

  },

  // 获取上下架列表
  getShelfQuery(isLoadMore) {
    this.setData({
      'loading.hasMore': false
    })
    if (isLoadMore) {
      this.setData({
        "loading.show": true,
      })
    } else {
      this.setData({
        "loading.pageIndex": 1,
      })
    }
    let { month } = this.data;
    let type = this.data.activeOrderType;
    month = month.replace(/\-/g, "");
    if (!month) {
      Toast('请选择时间！');
      return;
    }
    getShelfQuery({
      page: this.data.loading.pageIndex,
      size: this.data.loading.size,
      type,
      month
    })
      .then((res) => {
        let list = null
        let hasMore = false
        let shelfQueryList = this.data.shelfQueryList;
        if (type == 1) {
          if (this.data.loading.pageIndex == 1) {
            shelfQueryList = []
          }
          if (res.data && res.data.length) {
            list = res.data;
            hasMore = res.data.length >= 10

            list = shelfQueryList.concat(list);

          } else {
            list = shelfQueryList;
          }
          this.setData({
            shelfQueryList: this.formatList(list),
            'loading.hasMore': hasMore,
            'loading.pageIndex': this.data.loading.pageIndex + 1,
            'loading.show': false,
            "loading.init": false
          })
        }
        if (type == 0) {
          let soldOutList = this.data.soldOutList;
          if (this.data.loading.pageIndex == 1) {
            soldOutList = []
          }
          if (res.data && res.data.length) {
            list = res.data;
            hasMore = res.data.length >= 10
            list = soldOutList.concat(list);

          } else {
            list = soldOutList;
          }
          this.setData({
            soldOutList: this.formatList(list),
            'loading.hasMore': hasMore,
            'loading.pageIndex': this.data.loading.pageIndex + 1,
            'loading.show': false,
            "loading.init": false
          })
        }

      })
      .catch(() => {
        this.setData({
          'loading.show': false,
          "loading.init": false,
        })
      })
  },
  clickCloseMoDoal() {
    this.setData({
      isShowComfirmModal: false
    })
  },
  // 确认核销
  confirmationOfWriteOff() {
    let { writeOffLogId } = this.data;
    confirmationOfWriteOff({
      writeOffLogId
    })
      .then(() => {
        Toast('核销成功');
        this.getCommodityWriteOffList(false)
        this.setData({
          isShowComfirmModal: false
        })
      })
      .catch(() => {
        this.setData({
          isShowComfirmModal: false
        })
      })
  },
  // 获取核销列表数据
  getCommodityWriteOffList(isLoadMore) {
    this.setData({
      'cancelloading.hasMore': false
    })
    if (isLoadMore) {
      this.setData({
        "cancelloading.show": true,
      })
    } else {
      this.setData({
        "cancelloading.pageIndex": 1,
      })
    }
    let { date } = this.data;
    if (!date) {
      Toast('请选择时间！');
      return;
    }
    commodityWriteOffList({
      writeOffCodeUseTime: date,
      page: this.data.cancelloading.pageIndex,
      size: this.data.cancelloading.size,
    })
      .then(data => {
        let commodityWriteOffList = this.data.commodityWriteOffList;
        if (this.data.cancelloading.pageIndex == 1) {
          commodityWriteOffList = []
        }
        let list = null
        let hasMore = false
        if (data && data.length) {
          list = data;
          hasMore = data.length >= 10
          list = commodityWriteOffList.concat(list)
        }
        this.setData({
          commodityWriteOffList: this._formatList(list),
          'cancelloading.hasMore': hasMore,
          'cancelloading.pageIndex': this.data.loading.pageIndex + 1,
          'cancelloading.show': false,
          "cancelloading.init": false
        })
      })
      .catch(() => {
        this.setData({
          'loading.show': false,
          "loading.init": false,
        })
      })

  },
  // 加载更多
  loadMore() {
    if (this.data.cancelloading.hasMore) {
      this.setData({
        page: this.data.cancelloading.pageIndex + 1
      })
      this.getCommodityWriteOffList(true)
    }
  },

  loadMoreList() {
    if (this.data.loading.hasMore) {
      this.setData({
        page: this.data.loading.pageIndex + 1,
      })
      this.getShelfQuery(true);
    }
  },

  // 长按复制id
  copy(e) {
    var that = this;
    let data = e.target.dataset.id;
    wx.setClipboardData({
      data: data,
      success: function (res) {
      }
    });
  },


  // 格式化时间
  _formatList(list) {
    if (!list || !list.length) {
      return list;
    }
    list.forEach((item => {
      item.startActTime = dateUtil.getDateTime(item.writeOffCodeUseTime);

    }))
    return list;
  },
  formatList(time) {
    if (!time || !time.length) {
      return time;
    }
    time.forEach((item => {

      item.startActTime = dateUtil.getDateTime(item.createTime);
    }))
    return time;
  }
})
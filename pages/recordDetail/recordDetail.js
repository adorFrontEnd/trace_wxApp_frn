// pages/recordDetail/recordDetail.js
import router from '../../router/router.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import dateUtil from '../../utils/dateUtil';
import Toast from '../../utils/toast.js';
import { shipList, shipDetailList } from '../../api/delivery/delivery.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: null,
    loading: {
      hasMore: true,
      show: false,
      pageIndex: 1,
      init: true,
      size: '10'
    },
    deliveryDetailList:null,
    id:null,
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    if (options && options.date && options.id) {

      this.setData({
        date: options.date,
        id: options.id,
        list: options
      });
    }
  },
  getShipDetailList(isLoadMore) {
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
    let { date, id } = this.data;
    let time = date.replace(/\-/g, "");
    shipDetailList({
      page: this.data.loading.pageIndex,
      size: this.data.loading.size,
      time,
      id
    })
      .then(res => {
        let list = null;
        let hasMore = res.hasMore
        let { deliveryDetailList } = this.data;
        if (this.data.loading.pageIndex == 1) {
          deliveryDetailList = []
        }
        if (res.data && res.data.length) {
          list = res.data;
          list = deliveryDetailList.concat(list);
        } else {
          list = deliveryDetailList;
        }
        this.setData({
          deliveryDetailList: this._formatList(list),
          'loading.hasMore': hasMore,
          'loading.pageIndex': this.data.loading.pageIndex + 1,
          'loading.show': false,
          "loading.init": false
        })

      })
  },
  //  加载更多
  loadMoreList() {
    if (this.data.loading.hasMore) {
      this.setData({
        page: this.data.loading.pageIndex + 1,
      })
      this.getShipDetailList(true);
    }
  },
  onShow: function () {

    this.getShipDetailList()
  },
  // 格式化时间
  _formatList(list) {
    if (!list || !list.length) {
      return list;
    }
    list.forEach((item => {
      item.startActTime = dateUtil.getDateTime(item.createTime);

    }))
    return list;
  }

})
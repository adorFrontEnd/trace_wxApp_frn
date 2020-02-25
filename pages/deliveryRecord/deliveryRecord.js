// pages/agencyChoose/agencyChoose.js

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
    date: dateUtil.getNowDate().substring(0, 7),
    loading: {
      hasMore: true,
      show: false,
      pageIndex: 1,
      init: true,
      size: '10'
    },
    deliveryList: null
  },
  onLoad() {
    this.getShipList()
  },
  // 获取发货列表
  getShipList(isLoadMore) {
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
    let { date } = this.data;
    let time = date.replace(/\-/g, "");
    shipList({
      page: this.data.loading.pageIndex,
      size: this.data.loading.size,
      time
    })
      .then(res => {
        let list = null;
        let hasMore = res.hasMore
        let { deliveryList } = this.data;
        if (this.data.loading.pageIndex == 1) {
          deliveryList = []
        }
        if (res.data && res.data.length) {
          list = res.data;
          list = deliveryList.concat(list);
        } else {
          list = deliveryList;
        }
        this.setData({
          deliveryList: list,
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
      this.getShipList(true);
    }
  },

  onShow: function () {


  },

  bindDateChange(e) {
    this.setData({ date: e.detail.value });
    this.getShipList()

  },
  goRecordDetail(e) {
    let { date } = this.data;
    let id = e.currentTarget.dataset.id;
    let list = e.currentTarget.dataset.list;
    router.go('recordDetail', { date ,id,...list})

  }
})
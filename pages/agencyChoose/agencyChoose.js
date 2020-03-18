// pages/agencyChoose/agencyChoose.js

import router from '../../router/router.js';
import {
  clearCacheAgencyInfo,
  addAgencyInfoItem,
  getCacheAgencyInfo,
  setCacheDealerName,
  getCacheDealerName,
  getCacheLogistics,
  setCacheLogistics,
  clearCacheLogistics,
  setCacheAgencyInfo
} from '../../api/localStorage/agency.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import { getAgencyData } from '../../api/agency/agency.js';
import Toast from '../../utils/toast.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    agencyHistoryInfo: null,
    agencyInfo: null,
    inputValue: null,
    logisticsData: null,
    isChecked: false,
    objLength: '',
    data: null

  },

  // 获取手机号
  getPhone(e) {
    let phone = e.detail.value;
    this.setData({
      phone
    })
    this.getCacheAgencyData()
  },

  // 清除手机号
  clearInputEvent() {
    this.setData({
      'inputValue': ''

    })

  },

  // 点击查询
  loginClicked() {
    let { phone } = this.data;
    if (!phone) {
      Toast('请输入手机号！');
      return;
    }
    if (phone.length !== 11) {
      Toast('手机号格式不正确!');
      return;
    }
    getAgencyData({ phone })
      .then(data => {
        this.setData({
          agencyInfo: data
        })
        let userInfo = getCacheUserInfo();
        if (phone === userInfo.phone) {
          Toast("不能选择自己!");
        } else {
          addAgencyInfoItem(data);
        }
        this.getCacheAgencyData();
      })
      
  },

  onShow: function () {
    this.getCacheAgencyData();
    let logisticsData = getCacheLogistics();
    this.setData({
      logisticsData
    })
  },

  // 获取缓存经销商数据
  getCacheAgencyData() {
    let agencyHistoryInfo = getCacheAgencyInfo();
    var objLength = Object.keys(agencyHistoryInfo).length;
    this.setData({
      agencyHistoryInfo,
      objLength
    })
    // 模糊查询
    let agencyInfo = [];
    for (var i in agencyHistoryInfo) {
      if (agencyHistoryInfo[i].phone.indexOf(this.data.phone) != -1) {
        agencyInfo.push(agencyHistoryInfo[i]);
        this.setData({
          agencyHistoryInfo: agencyInfo
        })
      }
    }
  },

  // 点击删除
  deleteClick(e) {
    let agencyInfo = e.target.dataset.item;
    let agencyHistoryInfo = getCacheAgencyInfo();
    var objLength = Object.keys(agencyHistoryInfo).length;
    for (let key in agencyHistoryInfo) {
      if (key == agencyInfo.id) {
        delete agencyHistoryInfo[key];
      }
    }
    setCacheAgencyInfo(agencyHistoryInfo);
    this.setData({
      agencyHistoryInfo,
      objLength
    })
    if (objLength == 1) {
      this.setData({
        objLength: 0
      })
    }
  },
  // 点击清除所有
  clickClearAll() {
    setCacheAgencyInfo(null);
    let agencyHistoryInfo = getCacheAgencyInfo();
    var objLength = Object.keys(agencyHistoryInfo).length;
    this.setData({
      agencyHistoryInfo,
      objLength
    })

  },
  /***********************跳转路由********************/
  goIndex(e) {
    let dealerData = e.currentTarget.dataset.item;
    if (dealerData) {
      this.setData({
        isChecked: true,
        data: dealerData
      })
    }
    setCacheDealerName(dealerData);
    router.goBack('deliverManage');
  }
})
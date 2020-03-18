import router from '../../router/router.js';

import {
  userLogout,
  isUserLogin,
  clearCacheAgencyInfo,
  setCacheDealerName,
  setCacheAgencyInfo,
  clearCacheLogistics
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
  scanTraceCodeWithKey
} from '../../api/wx/wxScanCode.js';
import Toast from "../../utils/toast.js";
import {
  getCacheDealerName,
  setCacheLogistics,
  getCacheLogistics
} from '../../api/localStorage/agency.js';
import {
  getAgencyData,
  getCodeDetail,
  getVersionFrn
} from '../../api/agency/agency.js';
import AppConfig from '../../config/app.config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    shipStatus: null,
    storeStatus: null,
    version: AppConfig.version
  },
  onLoad() {
    let userInfo = getCacheUserInfo();
    this.setData({ userInfo })
  },
  onShow() {
    let userInfo = getCacheUserInfo();
    if (userInfo) {
      
      this.setData({
        userInfo,
        shipStatus: userInfo.shipStatus,
        storeStatus: userInfo.storeStatus
      })

    }

  },


  logoutClick() {
  
    wx.showModal({
      title: '提示',
      content: '确认要注销吗?',
      success(res) {
        if (res.confirm) {
          userLogout();
          wx.setStorage({
            key: "_agencyInfo",
            data: null
          })
          wx.setStorage({
            key: "_dealerName",
            data: null
          })
          wx.setStorage({
            key: "_logistics",
            data: null
          })
        
          router.go('user.login');
        }
      }
    })

  },




  godeliverManage() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('deliverManage');
  },
  goSetting() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('setting');
  },
  goPassowrd() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('passowrd')
  },
  goshopManage() {
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('shopManage')
  },
  goDeliveryRecord(){
    if (!isUserLogin()) {
      router.go('user.tipInfo');
      return
    }
    router.go('deliveryRecord')
    
  }
})
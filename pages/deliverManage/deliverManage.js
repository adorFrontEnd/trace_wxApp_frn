import router from '../../router/router.js';

import { userLogout, isUserLogin } from '../../api/localStorage/login.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import { picUrlPrefix } from '../../config/http.config.js';
import { parseScanCode, commonScanCode, scanTraceCodeWithKey,scanCode } from '../../api/wx/wxScanCode.js';
import Toast from "../../utils/toast.js";
import {
  getCacheDealerName,
  setCacheLogistics,
  getCacheLogistics,
  setCacheDealerName
} from '../../api/localStorage/agency.js';
import { getAgencyData, getCodeDetail, getVersionFrn } from '../../api/agency/agency.js';
Page({
  data: {
    pageBadge: null,
    activeWorkType: 1,
    picUrlPrefix: picUrlPrefix,
    dealerName: null,
    id: null,
    logistics: null,
    dealer: null,
    dealerId: null,
    logistics: null,
    userInfo:null

  },
  onLoad: function (options) {

   
  },
  /** 生命周期************************************************************************/
  onShow() {
    let userInfo = getCacheUserInfo();
    if (!userInfo) {
      userLogout();
      router.redirect('user.login');
    } else {
      this.setData({
        userInfo
      })
    }
    let dealerData = getCacheDealerName();
    if (dealerData && dealerData.id) {
      this.setData({
        dealerName: dealerData.dealerName,
        dealerId: dealerData.id
      
      })
    }
  },
  // 点击扫描物流单号
  scanlogistics() {
    this.setData({
      logistics:''
    })
    scanCode()
      .then((res) => {
        if (res.result.charAt(res.result.length - 1) == "@" || res.result[0]=='X' ) {
          Toast('请扫描正确的物流单号!')
          return;
        } else {
          setCacheLogistics(res.result);
          this.setData({
            logistics: res.result
          })
        }
      })
  },
  // 扫描二维码
  scanCode() {
    let { dealerId, logistics } = this.data;
    if (logistics=={}){
      logistics=null
    }
    if (!logistics && !dealerId) {
      Toast('单号和经销商必须选择一个！');
      return;
    }
    scanTraceCodeWithKey()
      .then(data => {
        if (data && data.code) {
          this.setData({
            id: data.code
          })
        }else{
          this.setData({
            id: data
          })
        }
        let { id } = this.data;
        return getCodeDetail({ id })
          .then((res) => {
            console.log(logistics)
            router.go('agency', { dealerId, logistics, ...res });
          })
        
      })
      .catch(() => {
        Toast("请扫描正确的二维码！")
      })
  },
  // 获取物流单号
  getNumber(e) {
    let logistics = e.detail.value;
    setCacheLogistics(logistics);
    this.setData({
      logistics
    })
  },
  cleartrackingNumber() {
    setCacheLogistics(null);
    this.setData({
      logistics: null
    })
  },
  cleardealerName() {
    setCacheDealerName(null);
    this.setData({
      dealerName: null
    })
  },
  onUnload(){
    setCacheLogistics(null);
    setCacheDealerName(null);
  },
  //************************跳转路由******************** */

  goSetting() {
    router.go('setting');
  },
  goAgency() {
    router.go('agency');
  },
  goAgencyChoose() {
    router.go('agencyChoose');
  }

})
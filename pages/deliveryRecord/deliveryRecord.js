// pages/agencyChoose/agencyChoose.js

import router from '../../router/router.js';
import { getCacheUserInfo } from '../../api/localStorage/login.js';
import dateUtil from '../../utils/dateUtil';
import Toast from '../../utils/toast.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: dateUtil.getNowDate().substring(0,7),
 
  },
  onLoad() {
console.log(this.data.date)

  },


  onShow: function () {


  },

  bindDateChange(e) {
    this.setData({ date: e.detail.value });


  },
  goRecordDetail() {
    let { date}=this.data
    router.go('recordDetail', { date})

  }
})
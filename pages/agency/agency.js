// pages/agency/agency.js
import { parseScanCode, commonScanCode, scanTraceCodeWithKey } from "../../api/wx/wxScanCode.js";
import { getCodeDetail, confirmDelivery, getPackingDetails } from "../../api/agency/agency.js";
import router from '../../router/router.js';
import {
  getCacheDealerName,
  setCacheLogistics,
  getCacheLogistics,
  setCacheDealerName
} from '../../api/localStorage/agency.js';
import Toast from "../../utils/toast.js";
Page({
  /**
  * 页面的初始数据
  */
  data: {
    goodsDetail: null,
    id: null,
    goodsDetailArr: [],
    dealerId: null,
    logistics: "",
    isClicked: false,
    isDisabled: false
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    if (options && (options.logistics || options.dealerId)) {
     
      this.setData({
        logistics: options.logistics,
        dealerId: options.dealerId
      });
    }
    if (options) {
      let goodsDetail = options;
      let goodsDetailArr = [];
      goodsDetailArr.push(goodsDetail);
      this.setData({
        goodsDetailArr,
        goodsDetail
      });
      this.data.goodsDetailArr.map((item) => {
        if (item.type == 1) {
          this.setData({
            isClicked: true
          })
        }
      })
    }
  },
  // 点击发货成功
  clickDeliverGoods() {
    let { goodsDetailArr, dealerId, logistics } = this.data;
    console.log(logistics)
    let idList = goodsDetailArr.map(v => v.id);
    if (idList.length==0 ){
      Toast('没有发货的商品，请扫码添加！');
      return;
    }
    // let idList = this.formatDeliveryId(goodsDetailArr);
 
    confirmDelivery({
      idList,
      dealerId,
      logistics
    }).then(() => {
      wx.showToast({
        title: "发货成功",
        icon: "success",
        duration: 2000
      });
      this.setData({
        isDisabled:true
      })
      setCacheLogistics(null);
      setTimeout(() => {
        this.goIndex()
      }, 500)
    });
  },
  // 扫码添加
  scanCode() {
    scanTraceCodeWithKey()
      .then(data => {
        if (data) {
          this.setData({
            id: data.code
          });
        }
        let { id } = this.data;
        return getCodeDetail({ id })
          .then(res => {
            this.setData({
              goodsDetail: res
            });
            let { goodsDetail } = this.data;
            let goodsDetailArr = this.data.goodsDetailArr;
            if (goodsDetailArr.find(v => v.id === goodsDetail.id)) {
              Toast("请勿重复添加");
              return void 0;
            }
            goodsDetailArr.push(goodsDetail);
            this.setData({
              goodsDetailArr
            });
          });
      })
      .catch(() => {
        Toast("请扫描正确的二维码！");
      })

  },
  // 点击删除
  clickDelete(e) {
    let index = e.target.dataset.index;
    var goodsDetailArr = this.data.goodsDetailArr;
    goodsDetailArr.splice(index, 1);
    this.setData({
      goodsDetailArr
    })
  },
  // 格式化确认发货时参数idlist
  formatDeliveryId(arr) {
    if (!arr || !arr.length) {
      return ""; 
    }
    let resultArr = arr.map(item => `${item.id}:${item.not}`);
    let resultStr = resultArr.join();
    return resultStr
  },
  goIndex() {
    router.goIndex();
  },

  goAgencyBoxList(e) {
    let id = e.currentTarget.dataset.id;
    router.go('agencyBoxList', { id });

  },


  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () { }
});

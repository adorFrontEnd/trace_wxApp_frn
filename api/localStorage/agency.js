import baseHttpProvider from '../base/baseHttpProvider';
import {
  frnId
} from "../../config/app.config.js";
import md5 from '../../lib/md5/md5.js'
import Toast from '../../utils/toast.js'

//获取缓存经销商信息
const getCacheAgencyInfo = () => {
  let aInfo = wx.getStorageSync('_agencyInfo');
  let result = aInfo || {};
  return result
};

//设置缓存经销商信息
const setCacheAgencyInfo = (agencyInfo) => {
  wx.setStorage({
    key: "_agencyInfo",
    data: agencyInfo
  })
};

const addAgencyInfoItem = (agencyInfo) => {
  if (!agencyInfo || !agencyInfo.id) {
    return;
  }
  let aInfoMap = getCacheAgencyInfo();
  let id = agencyInfo.id;
  aInfoMap[id] = {
    ...agencyInfo,
    stamp: Date.now()
  };
  setCacheAgencyInfo(aInfoMap);
}
// 清除缓存经销商数据
const clearCacheAgencyInfo = () => {
  setCacheAgencyInfo(null);
}
// 设置缓存经销商名字
const setCacheDealerName = (dealerName) => {
  wx.setStorage({
    key: "_dealerName",
    data: dealerName
  })
};
// 获取缓存经销商名字
const getCacheDealerName = () => {
  let dInfo = wx.getStorageSync('_dealerName');
  let result = dInfo || {};
  return result
};
// 清除缓存经销商数据
const clearCacheDealerName = () => {
  wx.setStorage({
    key: "_dealerName",
    data: null
  })
}
// 设置缓存获取详情数据
const setCacheAgencyDetail = (agencyDetail) => {
  wx.setStorage({
    key: "_agencyDetail",
    data: agencyDetail
  })
};
// 获取缓存获取详情数据
const getCacheAgencyDetail = () => {
  let aInfo = wx.getStorageSync('_agencyDetail');
  let result = aInfo || {};
  return result
};
// 缓存物流单号
const setCacheLogistics = (logistics) => {
  wx.setStorage({
    key: "_logistics",
    data: logistics
  })
};
// 获取物流单号
const getCacheLogistics = () => {
  let lInfo = wx.getStorageSync('_logistics');
  let result = lInfo || {};
  return result
};
// 清除缓存经销商数据
const clearCacheLogistics = () => {
  wx.setStorage({
    key: "_logistics",
    data: null
  })
}
const setCacheAgency = (agency) => {
  wx.setStorage({
    key: "_agency",
    data: agency
  })
};
module.exports = {
  clearCacheAgencyInfo,
  addAgencyInfoItem,
  getCacheAgencyInfo,
  setCacheAgencyInfo,
  setCacheDealerName,
  getCacheDealerName,
  setCacheLogistics,
  getCacheLogistics,
  clearCacheLogistics,
  setCacheAgency,
  clearCacheDealerName

}
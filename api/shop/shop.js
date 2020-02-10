// api/shop/shop.js.js
import baseHttpProvider from '../base/baseHttpProvider';
import {
  frnId
} from "../../config/app.config.js";
import md5 from '../../lib/md5/md5.js'
import Toast from '../../utils/toast.js'
// 获取上架商品列表
const getShelfQuery = (params) => {
  return baseHttpProvider.getApi('api/productShelf/shelfQuery', {
    page: 1,
    size: 10,
    ...params
  },
    { showLoading: true, total: true })
}

// 确认上架
const shelfOperationSingle = (params) => {
  return baseHttpProvider.postFormApi('api/productShelf/shelfOperationSingle', params, { showLoading: true })
}
// 扫描详情
const scanDetail = (params) => {
  return baseHttpProvider.postFormApi('api/commodityWriteOff/detail', params, { showLoading: true })
}
// 确认核销
const confirmationOfWriteOff = (params) => {
  return baseHttpProvider.postFormApi('api/commodityWriteOff/confirmationOfWriteOff', params, { showLoading: true })
}
// 核销列表数据
const commodityWriteOffList = (params) => {
  return baseHttpProvider.getApi('api/commodityWriteOff/commodityWriteOffList', {
    page: 1,
    size: 10,
    ...params
  },
    { showLoading: true })
}



module.exports = {
  getShelfQuery,
  shelfOperationSingle,
  scanDetail,
  confirmationOfWriteOff,
  commodityWriteOffList

}
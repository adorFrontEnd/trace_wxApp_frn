import baseHttpProvider from '../base/baseHttpProvider';
import {
  frnId
} from "../../config/app.config.js";
import md5 from '../../lib/md5/md5.js'
import Toast from '../../utils/toast.js'
// 获取经销商数据
const getAgencyData = (params) => {
  return baseHttpProvider.postFormApi('api/scanning/getDealerData', params,{showLoading:true})
}

// 获取货码详情
const getCodeDetail = (params)=>{
  return baseHttpProvider.getApi('api/scanning/queryProduct', params, { showLoading: true })
}
// 确认发货
const confirmDelivery = (params) => {
  return baseHttpProvider.postFormApi('api/scanning/confirmDelivery', params, { showLoading: true,total:true })
}
//获取箱码详情
const getPackingDetails = (params) => {
  return baseHttpProvider.getApi('api/scanning/getPackingDetails', params, { showLoading: true })
}


module.exports = {
  getAgencyData,
  getCodeDetail,
  confirmDelivery,
  getPackingDetails
 
}
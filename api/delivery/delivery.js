import baseHttpProvider from '../base/baseHttpProvider';
import {
  frnId
} from "../../config/app.config.js";
import md5 from '../../lib/md5/md5.js'
import Toast from '../../utils/toast.js'
// 发货列表
const shipList= (params) => {
  return baseHttpProvider.postFormApi('api/shipRecord/shipList', params, { showLoading: true, total:true })
}


// 发货详情
const shipDetailList = (params) => {
  return baseHttpProvider.postFormApi('api/shipRecord/shipDetailList', params, { showLoading: true, total: true })
}


module.exports = {
  shipList,
  shipDetailList

}
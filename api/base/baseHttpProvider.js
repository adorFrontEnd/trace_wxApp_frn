import { apiUrlPrefix } from '../../config/http.config.js'
import Toast from '../../utils/toast.js'
import { getCacheToken } from '../localStorage/login.js'
import { getEnctrySign } from '../../utils/sign.js'

/*@params 
  options:{  
    header:{},       // 请求头 
    total:false,    //  resolve(res.data)还是resolve(res.data.data)

    //提示信息
    toast:{      
        required: true,  // 是否失败或者错误提示      
        failTitle: "请求失败!",  // 失败提示     
        errorTitle: '网络错误!'   // 错误提示
      }  
    }
  }
*/

let GET = (url, params, options) => _request(url, params, 'GET', options ? Object.assign({}, options) : null)

let GET_TotalData = (url, params, options) => _request(url, params, 'GET', Object.assign({
  total: true
}, options))

let POST = (url, params, options) => _request(url, params, 'POST', options ? Object.assign({}, options) : null)

let POST_TotalData = (url, params, options) => _request(url, params, 'POST', Object.assign({
  total: true
}, options))

let postForm = (url, params, options) => {
  let _options = Object.assign({
    header: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }, options)
  return _request(url, params, 'POST', _options)
}

const getApi = (relativeUrl, params, options) => {
  let reqObj = getReqObj(relativeUrl, params, false, options && options.tokenless)
  return GET(reqObj.url, reqObj.params, Object.assign({
    apiReq: true
  }, options))
}

const getApi_TotalData = (relativeUrl, params, options) => getApi(relativeUrl, params, Object.assign({
  total: true,
  apiReq: true
}, options))

const postApi = (relativeUrl, params, options) => {
  let reqObj = getReqObj(relativeUrl, params, true, options && options.tokenless)
  return POST(reqObj.url, reqObj.params, Object.assign({
    apiReq: true
  }, options))
}
const postApi_TotalData = (relativeUrl, params, options) => postApi(relativeUrl, params, Object.assign({
  total: true,
  apiReq: true
}, options))

const postFormApi = (relativeUrl, params, options) => {
  let reqObj = getReqObj(relativeUrl, params, true, options && options.tokenless)
  return postForm(
    reqObj.url,
    reqObj.params,
    Object.assign({
      apiReq: true
    }, options)
  )
}

const postFormApi_TotalData = (relativeUrl, params, options) => postFormApi(relativeUrl, params, Object.assign({
  total: true,
  apiReq: true
}, options))

let _request = function (url, params, method, options) {

  options = options || {}
  let resolveTotal = options.total
  let defaultToastData = {
    required: true,
    failTitle: '请求失败!',
    errorTitle: '网络错误!',
    serverErrTitle: "服务器错误"
  }
  let apiReq = options.apiReq;
  let showLoading = options.showLoading;
  let showLoadingTitle = options.showLoadingTitle;

  let toastData = Object.assign(defaultToastData, options.toast)
  if (showLoading) {
    wx.showLoading({
      title: showLoadingTitle || "加载中..."
    });
  }
  return new Promise((resolve, reject) => {
    let reqData = {
      url: url,
      method: method || 'GET',
      data: params,
      success: res => {
        if (showLoading) {
          wx.hideLoading();
        }
        if (!apiReq) {
          resolve(res.data)
          return
        }

        if (res.data.status == 'SUCCEED') {
          if (resolveTotal) {
            resolve(res.data)
          } else {
            resolve(res.data.data)
          }
          return
        }

        if (toastData.required) {
          if (res.data.errorCode == "SYS.0000") {
            Toast(toastData.serverErrTitle)
          } else if (res.data.errorMessage) {
            Toast(res.data.errorMessage)
          } else {
            Toast(toastData.failTitle)
          }
        }
        reject(res.data.errorCode)
      },
      fail: res => {
        if (showLoading) {
          wx.hideLoading();
        }

        reject(res.data)
        if (toastData.required) {
          Toast(toastData.errorTitle)
        }
      }
      
    }

    if (options.header) {
      reqData.header = options.header
    }
    wx.request(reqData)
  })
}

const json2Form = json => {
  let arr = []
  for (var k in json) {
    arr.push(encodeURIComponent(k) + '=' + encodeURIComponent(json[k]))
  }
  return arr.join('&')
}

const getReqObj = (relativeUrl, params, isPost, tokenless) => {

  // 过滤值为null的参数
  params = filterNullKeyInParams(params);
  
  let urlObj = {}
  if (!tokenless) {
    urlObj.token = getCacheToken()
  }
  if (!isPost) {
    urlObj = Object.assign(urlObj, params)
  }
  let sign = getEnctrySign(relativeUrl, urlObj)

  urlObj = Object.assign(urlObj, { sign })
  let url = getEncodeUrl(relativeUrl, urlObj);
  return isPost ? { url, params } : { url }
}

const getEncodeUrl = (relativeUrl, urlObj) => {
  let result = apiUrlPrefix + relativeUrl + "?";
  let arr = [];
  for (let k in urlObj) {
    let str = "";
    if (k == "token") {
      str = k + '=' + urlObj[k];
    } else {
      str = k + '=' + encodeURIComponent(urlObj[k]);
    }

    arr.push(str);
  }
  result += arr.join("&");
  return result;
};

const filterNullKeyInParams = (data) => {
  if (!data) {
    return
  }
  for (let key in data) {
    if (!data[key] && data[key] !== 0 && data[key] !== "0") {
      delete (data[key])
    }
  }

  return data;
}

module.exports = {
  json2Form,
  GET,
  POST,
  postForm,
  getApi,
  postApi,
  postFormApi,
  GET_TotalData,
  POST_TotalData,
  getApi_TotalData,
  postApi_TotalData,
  postFormApi_TotalData,
  getReqObj,
  filterNullKeyInParams
}

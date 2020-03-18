import { getCacheFrnId } from '../api/localStorage/login.js';
const AppConfig = {
  // 3.2更新新增发货记录
  version: "3.0.1 2000302",
  // appId: "wx35be43bf20700d13",
  // aS: "58b586a258d40603d8e08eb63bab57cb",
  appId: "wxbd3efa27348f39f2",
  aS: "58b586a258d40603d8e08eb63bab57cb",
  frnId: getCacheFrnId(),
  baidumapAk: 'KeAnlSNeR9b5R54EHL5uxjFylw3V1FxU',
  markerIconPath: '../../assets/img/index/map-marker.png',
  markerActiveIconPath: '../../assets/img/index/map-marker-active.png',
  defaultLocation: {
    longitude: "104.06041306375",
    latitude: "30.57432537404"
  },
  // 押金金额
  depositAmount: 399,
  // 芝麻信用分免押金数
  zhimaxinyongScore: 700,
  stationQRprefix: "https://wx.xzs.adorsmart.com/wxapp/adorgroup/xzs/station",
  deviceQRprefix: "https://wx.xzs.adorsmart.com/wxapp/adorgroup/xzs/device",
};

module.exports = AppConfig;

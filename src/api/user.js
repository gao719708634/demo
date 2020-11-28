/**
 * 用户接口封装
 * @author  xiezhiwen
 * @date 2020-03-14
 */

import Req from '@/api/http.js';
import API_SERVER from '@/config/server-config';
import DefaultSetting from '@/config/default-setting';

// 本地开发或者本地测试环境
let HTTP_SERVER = API_SERVER.LOCAL; 

//生产环境请求地址
if (DefaultSetting.packType === 'production') {
  HTTP_SERVER = API_SERVER.SEVER;                           
} else if (DefaultSetting.packType === 'preprod') { // 预发布环境
  HTTP_SERVER = API_SERVER.PREPROD;
}
// HTTP_SERVER = 'http://192.168.50.110:8080';


const API_EXP = {

  /**
   * 个人信息接口
   * @param  {Object} params id
   * @config  {Object} params header等
   * @return {Promise}
   */

  getUserInfo (params, config) {
    return Req.post(
      `${HTTP_SERVER}/service/api/cas/user/info`, params, config
    );
  }
};

export default API_EXP;

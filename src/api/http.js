/**
 * axios 封装
 * @author  xiezhiwen
 * @date 2020-03-14
 */

import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';
import config from '@/config/default-setting';
// import Event from '@/common/event';
const { access_token } = config;

const openToken = true;

//myConfig 设置_qs === true 不转换为字符串,因为默认用json方式传输
function strParams(params, myConfig) {
  if (myConfig && myConfig._qs === true) {
    params = qs.stringify(params);
  }
  removeProperty(myConfig, '_qs');
  return params;
}

function removeProperty(obj, key) {
  if (obj && obj.hasOwnProperty(key)) {
    delete obj[key];
  }
  return obj;
}

let language = '';

// 给请求统一加上参数(带上token);
function addParams(params = {}) {
  if (language === '') {
    let Lang = localStorage.getItem('3i_lang') || 'cn';
    language = Lang === 'cn' ? 'zh_CN' : 'en_US';
  }
  let defaultParam = {
    requestId: +new Date(),
    client: {
      terminal: 'web',
      token: '',
      appVersion: '2.6.3',
      appId: 'androidcaller',
      language: language,
      deviceId: 'b2b3fb91bad796229accddba0efa7339'
    },
    encrypt: 'md5'
  };
  if (openToken) {
    defaultParam.client.token = Vue.ls.get(access_token);
  }
  defaultParam.data = params;
  return defaultParam;
  // }
}

const Axios = axios.create({
  baseURL: '',
  timeout: 15000,
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  }
});

//取消连续相同接口的请求
let CancelToken = axios.CancelToken;
let reqSources = [];
// 定义取消操作,如果afterRequest=true 表示请求成功后删除存储，否删除相同url
let removeSource = (config, afterRequest) => {
  for (let source in reqSources) {
    // 当多次请求相同时，取消之前的请求
    if (reqSources[source].umet === config.url + '&' + config.method) {
      if (!afterRequest) {
        reqSources[source].cancel('cancel-request');
      }
      reqSources.splice(source, 1);
    }
  }
};

Axios.interceptors.request.use(
  config => {
    // 不允许连续调用时取消接口的请求
    if (!config.noCancel) {
      removeSource(config);
      config.cancelToken = new CancelToken(c => {
        // 将取消函数存起来
        reqSources.push({ umet: config.url + '&' + config.method, cancel: c });
      });
    }
    return config;
  },
  err => {
    console.log(err);
    return Promise.reject(null);
  }
);

Axios.interceptors.response.use(
  response => {
    // console.log(response);
    const { data = {} } = response;
    if (!response.config.noCancel) {
      // 必需是加上存储的才进行删除
      // 请求结束后将对应存储的取消函数删除
      removeSource(response.config, true);
    }
    if (data.state && data.state.code === 2000000) {
      return data;
    } else if (data.state.code === -1) {
      //错误码定义
      // Event.$emit('login-timeout'); //通知APP.vue
      // Vue.prototype.$log('登录过期');
      console.log('登录过期');
      return data;
    } else {
      console.log('请求出错');
      return data;
      //是否要上报
      // Vue.prototype.$log('请求出错');
    }
  },
  error => {
    console.log(error, JSON.stringify(error));
    const { config, code, message } = error;
    if (code === 'ECONNABORTED' || message === 'Network Error') {
      // 请求超时
      // return new Promise(resolve => {
      //   setTimeout( async _ => {
      //     resolve(await Axios.request(config));
      //   }, 3000); // 设置发送间隔
      // });
      return Promise.resolve({
        success: false,
        state: {
          code: -8,
          msg: '请求出错，请稍后再试！'
        }
      });
    } else {
      if (message !== 'cancel-request') {
        return Promise.resolve({
          state: {
            code: -9,
            msg: '请求出错，请稍后再试！'
          }
        });
      } else {
        return Promise.resolve({
          state: {
            code: -10,
            // msg: '重复请求自动取消！'
            msg: ''
          }
        });
      }
    }
  }
);

const ajax = {};

ajax.get = (url, params, myConfig) => {
  return Axios.get(url, {
    params: addParams(params),
    ...myConfig
  });
};

ajax.delete = (url, params, myConfig) => {
  params = strParams(addParams(params, true), myConfig);
  return Axios.delete(url, {
    data: params,
    ...myConfig
  });
};

ajax.post = (url, params, myConfig) => {
  params = strParams(addParams(params), myConfig);
  return Axios(url, {
    method: 'post',
    data: params,
    ...myConfig
  });
};

ajax.put = (url, params, myConfig) => {
  params = strParams(addParams(params), myConfig);
  return Axios(url, {
    method: 'put',
    data: params,
    ...myConfig
  });
};

//多个请求
ajax.all = Axios.all;
ajax.spread = Axios.spread;
//返回请求存储
ajax.tokenSources = reqSources;
export default ajax;

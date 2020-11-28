/**
 * @author  xiezhiwen
 * 代理配置
 */
// const host = 'http://localhost:3003';
const host = 'http://130.120.2.90:8003/';
// const host = 'http://130.120.2.131:8003/';
// const host = 'http://130.120.3.154:8003/';
module.exports = {
  proxy: {
    '/api': {
      target: host, // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/api': '' // 将前缀 '/api' 转为 '/'
      }
      // bypass: function(req, res, proxyOptions) {
      //   console.log('proxy---bypass--------');
      //   return 'http://localhost:3003';
      // }
    },
    '/map': {
      target: 'http://api.map.baidu.com', // 接口域名
      changeOrigin: true,
      pathRewrite: {
        '^/map': ''
      }
    }
  }
};

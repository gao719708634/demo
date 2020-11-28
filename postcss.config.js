module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      rootValue: 37.5, //对应设计图宽度375*667
      // selectorBlackList: ['vant', 'mu'], // 忽略转换正则匹配项
      propList: ['*']
    }
  }
};

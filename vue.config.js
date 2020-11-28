const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: 'client',
  publicPath: './',
  configureWebpack: config => {
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true
          },
          runtimeChunk: {
            name: 'manifest'
          }
        }
      }
    };
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@router', resolve('./src/router'))
      .set('@static', resolve('src/static'))
      .set('@config', resolve('src/config'))
      .set('@assets', resolve('src/assets'))
      .set('@common', resolve('src/common'));
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${path.join(
            __dirname,
            './src/assets/less/reset-vant.less'
          )}";`
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    port: 8001
    // proxy: proxyConfig.proxy
  },
  lintOnSave: undefined,
  transpileDependencies: []
};

const path = require('path')

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      },
    },
  }
}
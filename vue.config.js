module.exports = {
  publicPath: process.env.NODE_ENV === 'production'  // 打包环境
    //   ? '/production-sub-path/'
       ? './' 
       : '/',
    // 相对路径
    // baseUrl: './',
    // configureWebpack: {
    //     devServer: {
    //         proxy: {
    //             //名字可以自定义，这里我用的是api
    //             '/api': {
    //               target: 'http://112.74.54.40:3000/',//设置你调用的接口域名和端口号 别忘了加http
    //               changeOrigin: true,//这里设置是否跨域
    //               pathRewrite: {
    //                 '^/api': ''
    //               }
    //             }
    //         }
    //     }
    // },
}
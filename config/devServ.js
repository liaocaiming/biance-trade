const path = require('path');
const api = require('./api');
const webpackConfig = require('./webpack.config');
const { createProxyMiddleware } = require('http-proxy-middleware');
const yargs = require('yargs');
const { name, dev, target, pro } = yargs.argv;

module.exports = {
  contentBase: webpackConfig({ name }).output.path,
  // publicPath: webpackConfig({ name }).output.path,
  compress: true,
  port: 3000,
  historyApiFallback: true,
  stats: 'errors-only',
  // proxy: {
  //   '/api': {
  //     target: 'http://47.74.177.128:3000',
  //     changeOrigin: true
  //   }
  // },
  // hot: true,
  // open: true,
  // publicPath: webpackConfig.output.publicPath,
  // watchContentBase: true,
  // inline: true,
  // stats: "errors-only", // 只打印错误
  // overlay: {
  //   warnings: true,
  //   errors: true
  // },
  // watchOptions: {
  //   poll: true
  // },
  before(app) {



    if (target) {
      app.use(
        '/api/v1',
        createProxyMiddleware({
          // target: "http://103.5.144.162:3000/",
          target,
          changeOrigin: true,
        }),
      );

      app.use(
        '/app/v1',
        createProxyMiddleware({
          // target: "http://103.5.144.162:3000/",
          target,
          changeOrigin: true,
        }),
      );
      return;
    }

    if (dev) {
      if (name === 'boss') {
        app.use(
          '/api/',
          createProxyMiddleware({
            target: "http://108.62.60.105/",
            target,
            changeOrigin: true,
          }),
        );
      }

      app.use(
        '/api/v1',
        createProxyMiddleware({
          // target: "http://103.5.144.162:3000/",
          target: 'https://test.huntertrades.com/',
          changeOrigin: true,
        }),
      );

      app.use(
        '/app/v1',
        createProxyMiddleware({
          // target: "http://103.5.144.162:3000/",
          target: 'https://test.huntertrades.com/',
          changeOrigin: true,
        }),
      );
      return;
    }

    if (pro) {
      app.use(
        '/app/v1',
        createProxyMiddleware({
          // target: "http://103.5.144.162:3000/",
          target: 'https://huntertrades.com/',
          changeOrigin: true,
        }),
      );
      return;
    }


    app.use('/api/v1', api());
    app.use('/app/v1', api());

    // if (name === "boss") {
    //   app.use(
    //     "/api",
    //     createProxyMiddleware({
    //       target: "http://47.74.177.128",
    //       changeOrigin: true,
    //     })
    //   );

    //   app.use(
    //     "/fapi",
    //     createProxyMiddleware({
    //       target: "http://fapi.binance.com",
    //       changeOrigin: true,
    //     })
    //   );

    //   return;
    // }
    // app.use(
    //   "/api",
    //   createProxyMiddleware({
    //     target: "http://47.74.177.128:80",
    //     changeOrigin: true,
    //   })
    // );
  },
  // stats: {
  //     assets: true,
  //     builtAt: true,
  //     colors: true,
  //     entrypoints: true,
  //     timings: true
  //   }
};

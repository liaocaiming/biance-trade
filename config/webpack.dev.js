const configFn = require('./webpack.config');

const devServer = require('./devServ');

const webpackDevServer = require('webpack-dev-server');

const webpack = require('webpack');

const { getIPAddress } = require('./utils/utils');

const yargs = require('yargs');

const { name, company } = yargs.argv;

const ip = getIPAddress();

const webpackConfig = configFn({ name, company });

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

const checkPort = require('./utils/checkPort');

const opn = require('opn');

const port = 3030;

checkPort(port).then(usePort => {
  webpackConfig.entry.index.unshift(
    `webpack-dev-server/client?http://localhost:${usePort}/`,
  );

  const compiler = webpack(webpackConfig);

  webpackDevServer.addDevServerEntrypoints(webpackConfig, devServer);

  const server = new webpackDevServer(compiler, devServer);

  server.listen(usePort, () => {
    console.log(`ip:  ${ip}`);

    // opn(`http://${ip}:${usePort}`);
    opn(`http://localhost:${usePort}`);
  });
});

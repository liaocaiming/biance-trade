const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const configFn = require('./webpack.config');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const Prompt = require('./prompt');

// const yargs = require('yargs').argv;
const utils = require('./utils/utils.js');

// const { name = 'hTrade', company = 'hTrade' } = yargs;

const proConfig = {
  mode: 'production',
  devtool: 'none',
};

const plugin = [
  new cleanWebpackPlugin(utils.resolve('docs'), {
    root: process.cwd(),
    verbose: true,
  }),
  new uglify(),
  // 压缩css
  new OptimizeCssAssetsPlugin(),
];

const compressing = require('compressing');

function build(options) {
  const { name, company } = options;

  const configJson = require(`../src/${name}/config/app.json`);

  const webpackConfig = configFn({ name, company });

  Object.assign(webpackConfig, proConfig);

  webpackConfig.output.publicPath = configJson.proConfig;

  webpackConfig.plugins = webpackConfig.plugins.concat(plugin);

  const compiler = webpack(webpackConfig);

  const zipName = `${name}-${company}-${configJson.version}.zip`;

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
      return;
    }

    compressing.zip
      .compressDir(
        utils.resolve(`docs/${name}`),
        utils.resolve(`docs/${zipName}`),
      )
      .then(() => {
        console.log(chalk.yellow(`Tip: 文件压缩成功，已压缩至【${zipName}】`));
      })
      .catch(err => {
        console.log(chalk.red('Tip: 压缩报错'));
        console.error(err);
      });
  });
}

async function initAction() {
  let userConfig = {};
  const { name } = await inquirer.prompt(Prompt.selectName);
  userConfig.name = name;

  const { company } = await inquirer.prompt(Prompt.selectCompany);
  userConfig.company = company;

  try {
    build(userConfig);
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  program
    .version('0.0.1')
    // .command("init")
    .action(initAction);

  await program.parseAsync(process.argv);
}

main();

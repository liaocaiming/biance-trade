const HtmlWebpackPlugin = require('html-webpack-plugin');

// const TsCheckerWebpackPlugin = require("ts-checker-webpack-plugin");

const webpack = require('webpack');

const utils = require('./utils/utils');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const WebpackBar = require('webpackbar');


const postcssPresetEnv = require(`postcss-preset-env`)

const mobilePhone = ['mobile', 'h-mobile', 'h-off', 'm-htrade'];

const cssLoader = [
  MiniCssExtractPlugin.loader,
  // "vue-style-loader",
  {
    loader: 'css-loader',
  },
];

module.exports = options => {
  const { name, company } = options;
  if (mobilePhone.indexOf(name) > -1) {
    cssLoader.push({
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-pxtorem',
              {
                rootValue: 100,
                unitPrecision: 5,
                propList: ['*'],
                selectorBlackList: [],
                replace: true,
                mediaQuery: false,
                minPixelValue: 2.2,
                exclude: '/node_modules/*',
              },
            ],
            // 'autoprefixer',
            // [
            //   'cssnano',
            //   {
            //     preset: 'default',
            //     zindex: false,
            //     reduceIdents: false,
            //   },
            // ],

            postcssPresetEnv({
              stage: 0,
            }),

          ],
        },
      },
    });
  }

  const config = {
    entry: {
      vendor: ['react', 'react-dom'],
      index: [utils.resolve(`src/${name}/index.tsx`)],
    },
    output: {
      filename: 'js/[name].[hash].js',
      path: utils.resolve(`docs/${name}`),
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
          },
        },
      },
    },

    devtool: 'eval-source-map',

    mode: 'development',

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.less'],
      alias: {
        '@utils': utils.resolve('src/@shared/utils'),
        '@shared': utils.resolve('src/@shared'),
        '@screens': utils.resolve('src/@screens'),
        '@containers': utils.resolve('src/@shared/containers'),
        '@typings': utils.resolve('src/typings'),
        '@src': utils.resolve('src'),
        '@components': utils.resolve('src/@shared/components'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: [/(node_modules|bower_components)/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { modules: false }],
                  '@babel/preset-typescript',
                  '@babel/preset-react',
                ],
                plugins: [
                  [
                    'import',
                    {
                      libraryName: 'antd',
                      libraryDirectory: 'es',
                      style: 'css',
                    },
                    'antDesign',
                  ],
                  [
                    'import',
                    {
                      libraryName: 'antd-mobile',
                      libraryDirectory: 'es',
                      style: 'css',
                    },
                    'antMobile',
                  ],
                ],
                cacheDirectory: true,
              },
            },
            // {
            //   loader: "string-replace-loader",
            //   options: {
            //     search: "./config/boss/index",
            //     replace: `./config/${name}/index`,
            //   },
            // },
          ],
        },

        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },

        {
          test: /\.css$/,
          exclude: /node_modules|antd\.css/,

          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                module: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          ],
        },

        {
          test: /\.css?$/,
          include: /node_modules|antd\.css/,
          use: cssLoader,
        },

        {
          test: /\.less$/,
          exclude: [/(node_modules|bower_components)/],
          use: [
            ...cssLoader,
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  strictMath: true,
                },
              },
            },
          ],
        },

        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024, // 1kB
                fallback: 'file-loader',
                name: '[hash].[ext]',
                outputPath: './img',
                publicPath: './img',
                esModule: false,
              },
            },
          ],
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf)/,
          use: [
            'file-loader'
          ]
        },

        {
          //处理 html 中通过 img 引入的图片，background-image 设置的图片不可以
          test: /\.html$/,
          use: 'html-loader',
        },

        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
    },

    plugins: [
      new WebpackBar(),

      new HtmlWebpackPlugin({
        template: utils.resolve(`src/${name}/index.html`),
        filename: 'index.html',
      }),

      new MiniCssExtractPlugin({
        filename: '[name][hash:8].css',
        chunkFilename: '[name][hash:8].css',
      }),

      // new TsCheckerWebpackPlugin(),

      new webpack.ProvidePlugin({
        React: 'react',
        ReactDom: 'react-dom',
      }),

      new VueLoaderPlugin(),

      new webpack.DefinePlugin({
        COMPANY: JSON.stringify(company),
      }),
    ],
  };

  return config;
};

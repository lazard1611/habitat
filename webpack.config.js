const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

//Change 'webpack' name in the proxy settings to your folder name
const settings = {
	host: 'localhost',
	port: 3000,
	proxy: 'webpack/frontend'
};

//Settings for entry points
const entryCss = {
	app: ['./src/styles/app.scss'],

	//If you need separate styles for different pages, uncomment code below and update entry names
	//home: ['./src/styles/home.scss'],
	//blog: ['./src/styles/blog.scss'],
};

const entryJs = {
	app: ['./src/scripts/app.js'],

	//If you need separate scripts for different pages, uncomment code below and update entry names
	//home: ['./src/scripts/home.js'],
};

module.exports = (env) => [
	{
		mode: 'development',
		entry: entryCss,
		output: {
			filename: './node_modules/[name].log',
			path: path.resolve(__dirname),
			assetModuleFilename: "./assets/img/[name][ext]",
		},
		module: {
			rules: [
				{
					test: /\.(css|sass|scss)$/,
					use: [
						MiniCssExtractPlugin.loader,
						{ loader: "css-loader", options: { sourceMap: true } },
						{ loader: "sass-loader", options: { sourceMap: true } },
						"postcss-loader",
					],
					sideEffects: true
				},
				{
					test: /\.(woff(2)?|ttf|eot)$/,
					type: 'asset/resource',
					generator: {
						filename: './assets/fonts/[name][ext][query]',
					}
				},
			]
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['./assets/css/*']
			}),
			new MiniCssExtractPlugin({
				filename: './assets/css/style.css',
			}),
			new MiniCssExtractPlugin({
				filename: './assets/css/app.min.css',
			}),
			new BrowserSyncPlugin({
				host: settings.host,
				port: settings.port,
				proxy: settings.proxy,
				files: ['./*.php', './**/*', '!./node_modules', '!./package.json'],
				notify: false,
				injectCss: true,
				reloadDelay: 0
			}),
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
				exclude: './assets/css/app.min.css',
			}),
		],
		optimization: {
			minimizer: [
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: ['default', { discardComments: { removeAll: true }, mergeRules: true }],
					},
					include: /\.min\.css$/i,
					exclude: './assets/css/style.css',
				}),
			],
			minimize: true,
		},
	},

	{
		entry: entryJs,
		output: {
			filename: './assets/js/scripts.js',
			path: path.resolve(__dirname),
			assetModuleFilename: "./assets/img/[name][ext]",
		},
		devtool: false,
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['./assets/js/*']
			}),
		],
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				},
			]
		}
	},
	{
		entry: entryJs,
		output: {
			filename: './assets/js/[name].min.js',
			path: path.resolve(__dirname),
			assetModuleFilename: "./assets/img/[name][ext]",
		},
		devtool: false,
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						}
					}
				},
			]
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: false,
						},
						compress: {
							drop_console: true,
						},
					},
					extractComments: false,
				}),
			],
			minimize: true,
		}
	},
];


//Update dependency
// npm i -g npm-check-updates
// ncu -u
// npm install

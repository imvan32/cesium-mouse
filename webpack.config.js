const webpack = require('webpack');

module.exports = {
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(bower_components|node_modules)/,
			loader: 'babel-loader',
		}],
	},
	externals: {
		cesium: 'Cesium'
	},
	output: {
		libraryTarget: 'window',
		library: 'CesiumMouse',
	},
	resolve: {
		extensions: [
			'js'
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: { warnings: false },
		}),
	]
};

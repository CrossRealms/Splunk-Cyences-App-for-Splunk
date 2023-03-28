const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('@splunk/webpack-configs/base.config').default;

const dev = process.env.NODE_ENV !== 'production';

module.exports = merge(baseConfig, {
    entry: {
        cs_product_setup: path.join(__dirname, 'src/cs_product_setup'),
    },
    output: {
        path: path.join(__dirname, '../cyences_app_for_splunk/appserver/static/js/build'),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
    ],
    devtool: dev ? 'inline-source-map' : false
});

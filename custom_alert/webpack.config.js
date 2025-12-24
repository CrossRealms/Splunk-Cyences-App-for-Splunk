const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('@splunk/webpack-configs/base.config').default;

const dev = process.env.NODE_ENV !== 'production';

module.exports = merge(baseConfig, {
    entry: {
        cs_custom_alert_create: path.join(__dirname, 'src/cs_custom_alert_create'),
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

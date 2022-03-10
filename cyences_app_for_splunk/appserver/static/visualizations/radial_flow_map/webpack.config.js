var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: 'radial_flow_map',
    resolve: {
        root: [
            path.join(__dirname, 'src'),
        ]
    },
    output: {
        filename: 'visualization.js',
        libraryTarget: 'amd'
    },
    externals: [
        'api/SplunkVisualizationBase',
        'api/SplunkVisualizationUtils',
        'splunkjs/mvc'
    ]
};
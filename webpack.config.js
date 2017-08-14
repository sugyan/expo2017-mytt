/* eslint-env node */

const webpack = require('webpack');

const config = module.exports = {
    entry: './app/assets/src/js/main.jsx',
    output: {
        path: __dirname + '/app/assets/javascripts',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        inline: true
    }
};

if (process.env.NODE_ENV === 'production') {
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ];
}

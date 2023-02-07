const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',// production | development
    entry: {
        index: path.resolve( __dirname,'src/index.ts')
    },
    output:{
        path: path.resolve( __dirname,'dist'),
        //filename:'[name].[contenthash].js',
        //clean: true,
    },

    devtool: false,//'inline-source-map',
    devServer:{
        static: path.resolve( __dirname, 'src'),
        port: 8080,// 8080
        open:   true,
        hot: true,
    },

    //loaders
    module:{
        rules:[
            {test: /\.css$/,use: ['style-loader', 'css-loader']},
            {test: /\.(svg|ico|png|jpg|webp|gif|jpeg)$/, type:'assets/img'},
            {test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {test: /\.(png|jpg|gif)$/i,
             use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                    }
                  },
                ],
               type: 'javascript/auto'
              }
        ]
    },

    resolve:{
        extensions: ['.ts','.js'],
    },

    //plugins
    plugins:[new HtmlWebpackPlugin({
        title: 'PIXIJS TYPESCRIPT',
        filename: 'index.html',
        template: path.resolve( __dirname, 'src/assets/temp.html')
    })],
};
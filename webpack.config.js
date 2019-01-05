const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",

    entry: {
        app: "./src/index.js"
    },

    devtool: "inline-source-map",

    devServer: {
        contentBase: "./dist",
        hot: true
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Flappy Bird HTML5 Clone"
        }),

        new webpack.HotModuleReplacementPlugin()
    ],

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }
};

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
            template: "./src/index.html"
        }),

        new webpack.HotModuleReplacementPlugin()
    ],

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }
};

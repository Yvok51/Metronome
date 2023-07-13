const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./client/index.tsx",
  devtool: "inline-source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/",
    clean: true,
  },
  module: {
    rules:[
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      /*
      {
        test: /\.scss$/,
        use:[
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
      },
      */
     {
        test: /\.wav$/,
        type: "asset/resource",
     }
    ], 
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".wav"],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "/client/index.html"
    }),
  ]
}

const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDEV = true; // process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [new MiniCssExtractPlugin({
	  filename: '[name].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
  })],
  mode: isDEV ? "development" : "production",
  entry: './src/script.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ 
		isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
		, "css-loader"],
      },
    ]
  }
};

// copy file.
fs.copyFile('src/index.html', 'dist/index.html', (err) => {
  if (err) throw err;
  console.log('index.html was copied to dist/index.html');
});
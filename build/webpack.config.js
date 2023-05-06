const fs = require('fs')
const path = require('path')
const StringReplacePlugin = require("string-replace-webpack-plugin");

const pixiVersion = 6;
const pixiPath = 
      pixiVersion == 5 ? './pixi/pixi@5.2.1.js' :
      pixiVersion == 6 ? './pixi/pixi@6.5.9.js' :
      './pixi/pixi@5.2.1.js';
const ourputPixiFile = 'pixi.miniprogram.v'+ pixiVersion +'.js'

function resolvePixiModule() {
  const code = fs.readFileSync(path.resolve(pixiPath), 'utf8')
  return code
}

module.exports = {
  entry: path.join(__dirname, '../src/index'),
  target: 'web',
  output: {
    path: path.join(__dirname, '../../../WebFront_Program/G-Shock.World.Webfront/gshock-world-wechat-app/utils'),
    // path: path.join(__dirname, '../example/libs'),
    filename: ourputPixiFile,
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            "@babel/preset-env",
          ],
          plugins: ["@babel/plugin-proposal-class-properties"]
        }
      },
      { 
        test: /\index.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /__INJECT_PIXI__/ig,
              replacement: () => {
                return resolvePixiModule()
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
      new StringReplacePlugin()
  ],
  optimization:{
    minimize: true,
  }
}

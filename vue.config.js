module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
     devtool: 'source-map',

  },
  configureWebpack: config => {
   config.entry.app = ["babel-polyfill", "./src/main.js"];
    config.devtool = 'source-map';
  },
}
//遇到这个报错时需要新建vue.config.js来这样做
//You are using the runtime-only build of Vue where the template compiler is not available.
//Either pre-compile the templates into render functions, or use the compiler-included build.



module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'], //module:@react-native/babel-preset
    plugins: ["nativewind/babel", ["@babel/plugin-transform-private-methods", { "loose": true }]]
  };
};
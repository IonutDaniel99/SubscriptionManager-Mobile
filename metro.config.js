const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const MetroConfig = require('@ui-kitten/metro-config');

const evaConfig = {
  evaPackage: '@eva-design/eva',
  // Optional, but may be useful when using mapping customization feature.
  // customMappingPath: './custom-mapping.json',
};

const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'json'],
  }
};

module.exports = async () => {
  const defaultConfig = await mergeConfig(getDefaultConfig(__dirname), config);
  return MetroConfig.create(evaConfig, defaultConfig);
};
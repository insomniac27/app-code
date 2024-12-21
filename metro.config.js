//const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
//
///**
// * Metro configuration
// * https://reactnative.dev/docs/metro
// *
// * @type {import('metro-config').MetroConfig}
// */
//const config = {};
//
//module.exports = mergeConfig(getDefaultConfig(__dirname), config);












const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
// metro.config.js

  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
    assetExts: ['glb', 'gltf', 'png', 'jpg', 'gif'],
  },

};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);


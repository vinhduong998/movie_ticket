const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path')
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const { resolver: { sourceExts, assetExts } } = getDefaultConfig(__dirname)

const config = {
  watchFolders: [
    path.resolve(__dirname, './src')
  ],
  resolver: {
    assetExts: assetExts,
    sourceExts: sourceExts,
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (target.hasOwnProperty(name)) {
            return target[name]
          }
          return path.join(process.cwd(), `./src/${name}`)
        },
      },
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// Babel config for Expo. The reanimated plugin MUST be last.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Resolves @vexoo/shared imports to the local source.
      ['module-resolver', {
        alias: { '@vexoo/shared': '../../packages/shared/src' },
      }],
      'react-native-reanimated/plugin', // must be last
    ],
  };
};

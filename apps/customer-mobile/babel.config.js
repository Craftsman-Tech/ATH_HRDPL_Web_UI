// Babel config for the Customer mobile app.
//
// NOTE vs apps/mobile: on Reanimated 4 the babel plugin moved out of
// react-native-reanimated and into react-native-worklets. Using the old
// 'react-native-reanimated/plugin' here fails at runtime with "Reanimated is not
// configured correctly". It must still be last in the plugin list.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@vexoo/shared': '../../packages/shared/src',
          '@vexoo/ui-native': '../../packages/ui-native/src',
        },
      }],
      'react-native-worklets/plugin', // must be last
    ],
  };
};

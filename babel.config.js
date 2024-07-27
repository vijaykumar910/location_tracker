api.cache(false)
module.exports = {
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },

    ]
  ]
  presets: ['module:@react-native/babel-preset'],
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@shared': '../../packages/shared'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        }
      ]
    ]
  };
};

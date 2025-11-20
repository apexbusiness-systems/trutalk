const path = require('path');

module.exports = {
  webpack: (config, { defaultLoaders }) => {
    // Transpile /packages/shared so Next will handle TSX/ESNext inside monorepo packages
    const sharedPath = path.resolve(__dirname, '../../packages/shared');

    config.module.rules.push({
      test: /\.[jt]sx?$/,
      include: [sharedPath],
      use: defaultLoaders.babel
    });

    // Make tsconfig aliases available to webpack as well
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './src'),
      '@shared': sharedPath
    };

    return config;
  }
};

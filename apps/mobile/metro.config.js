const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '..', '..');

const config = getDefaultConfig(projectRoot);

// Watch the monorepo root so shared packages are visible to Metro
config.watchFolders = config.watchFolders || [];
if (!config.watchFolders.includes(workspaceRoot)) {
  config.watchFolders.push(workspaceRoot);
}

// Resolve extra node modules from project node_modules first.
// If package not found, Metro falls back to workspace root modules.
config.resolver = {
  ...config.resolver,
  extraNodeModules: new Proxy({}, {
    get: (_, name) => path.join(projectRoot, 'node_modules', name)
  }),
  sourceExts: [...config.resolver.sourceExts, 'cjs'] // cjs sometimes needed for packages
};

module.exports = config;

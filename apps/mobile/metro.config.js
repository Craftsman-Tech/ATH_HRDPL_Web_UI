// Metro config — Expo's default + custom watchFolders so changes to
// packages/shared/* hot-reload the mobile app.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot     = __dirname;
const workspaceRoot   = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the entire monorepo, not just the mobile app folder.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the mobile app first, then the workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot,    'node_modules'),
  path.resolve(workspaceRoot,  'node_modules'),
];

// 3. Disable hierarchical lookup so packages/shared resolves cleanly.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;

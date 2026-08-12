// Metro config — Expo's default plus the monorepo wiring, so edits to
// packages/shared and packages/ui-native hot-reload in this app.
// Mirrors apps/mobile/metro.config.js.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole monorepo, not just this app.
config.watchFolders = [workspaceRoot];

// 2. Resolve from the app first, then the workspace root. App-first matters while
//    apps/mobile and this app sit on different React Native versions.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Disable hierarchical lookup so workspace packages resolve deterministically.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;

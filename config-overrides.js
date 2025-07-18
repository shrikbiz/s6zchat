const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');
const fs = require('fs');

// Read jsconfig.json
const jsConfigPath = path.resolve(__dirname, 'jsconfig.json');
const jsConfig = JSON.parse(fs.readFileSync(jsConfigPath, 'utf8'));

// Extract paths from jsconfig.json
const jsConfigPaths = jsConfig.compilerOptions.paths;
const baseUrl = jsConfig.compilerOptions.baseUrl || 'src';

// Convert jsconfig paths to webpack aliases
const webpackAliases = {};
Object.keys(jsConfigPaths).forEach(alias => {
  const aliasPath = jsConfigPaths[alias][0];
  // Remove the wildcard and resolve the path
  const cleanAlias = alias.replace('/*', '');
  const cleanPath = aliasPath.replace('/*', '');
  webpackAliases[cleanAlias] = path.resolve(__dirname, baseUrl, cleanPath);
});

module.exports = override(
  addWebpackAlias(webpackAliases)
); 
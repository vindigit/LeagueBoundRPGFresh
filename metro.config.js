const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/private/defaults/exclusionList").default;
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const escapePathForRegex = (value) => value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
const ignoredDirectories = [
  "LeagueBoundRPG",
  ".expo-export-diagnose",
  ".expo-export-test",
  ".expo-export-test-2",
  ".expo-export-verify-boxscore",
];

config.resolver.blockList = exclusionList(
  ignoredDirectories.map((directory) => {
    const absoluteDirectory = path.resolve(__dirname, directory);
    return new RegExp(`^${escapePathForRegex(absoluteDirectory)}\\\\.*`);
  }),
);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "zustand/middleware") {
    return {
      filePath: path.join(__dirname, "node_modules", "zustand", "middleware.js"),
      type: "sourceFile",
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });

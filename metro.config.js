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

module.exports = withNativeWind(config, { input: "./global.css" });

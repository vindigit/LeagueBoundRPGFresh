module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV ?? "development");
  const isTest = process.env.NODE_ENV === "test";

  return {
    presets: isTest
      ? ["babel-preset-expo"]
      : ["babel-preset-expo", "nativewind/babel"],
    plugins: [],
  };
};

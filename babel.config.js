module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV ?? "development");
  const isTest = process.env.NODE_ENV === "test";

  return {
    presets: isTest
      ? [["babel-preset-expo", { unstable_transformImportMeta: true }]]
      : [["babel-preset-expo", { unstable_transformImportMeta: true }], "nativewind/babel"],
    plugins: [],
  };
};

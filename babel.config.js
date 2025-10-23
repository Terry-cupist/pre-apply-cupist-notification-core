module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./",
            "@app": "./src/app",
            "@processes": "./src/processes",
            "@features": "./src/features",
            "@entities": "./src/entities",
            "@shared": "./src/shared",
          },
        },
      ],
    ],
  };
};

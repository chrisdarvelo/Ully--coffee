module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          typescript: { allExtensions: true, isTSX: true },
        },
      ],
    ],
  };
};

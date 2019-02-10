module.exports = (api) => {
  const __DEV__ = api.env('development');

  api.cache.forever();

  return {
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: false,
          useESModules: true
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'entry',
          debug:  __DEV__
        }
      ]
    ]
  };
};

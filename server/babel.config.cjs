module.exports = (api) => {
  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
          useBuiltIns: 'usage',
          corejs: {
            version: '3.15.2',
            proposals: true,
          },
          shippedProposals: true,
        },
      ],
      '@babel/preset-react',
    ],
    plugins: ['@babel/plugin-syntax-top-level-await'],
    sourceMaps: 'both',
  };
  if (!api.env('test')) {
    config.presets[0][1].modules = false;
  }
  return config;
};

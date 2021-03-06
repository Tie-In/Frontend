module.exports = {
  babelrc: false,
  presets: [
    'babel-preset-es2015',
    'babel-preset-es2016',
    'babel-preset-react',
    'babel-preset-stage-0',
  ].map(require.resolve),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
  ].map(require.resolve).concat([
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
    }],
  ]),
};

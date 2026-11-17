/**
 * Pruebas unitarias del frontend con Jasmine + Karma (requisito de la asignatura).
 * Karma abre Chrome sin ventana (ChromeHeadless), empaqueta las pruebas con webpack + babel
 * (para entender JSX) y genera el reporte de cobertura en coverage/ (insumo del
 * "Documento de cobertura del testing").
 *
 *   npm test            -> ejecuta una vez
 *   npm run test:watch  -> se queda escuchando cambios
 */
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      { pattern: 'tests/**/*.spec.js', watched: false },
      { pattern: 'tests/**/*.spec.jsx', watched: false },
      { pattern: 'public/**', included: false, served: true, watched: false },
    ],
    proxies: { '/logo.svg': '/base/public/logo.svg' },
    preprocessors: {
      'tests/**/*.spec.js': ['webpack'],
      'tests/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', { targets: 'last 2 Chrome versions' }], ['@babel/preset-react', { runtime: 'automatic' }]],
                // Instrumenta solo el código de src/ para medir cobertura.
                plugins: [['istanbul', { include: ['src/**'] }]],
              },
            },
          },
          // Los componentes no importan CSS, pero por si acaso se ignora.
          { test: /\.css$/, type: 'asset/source' },
        ],
      },
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{ type: 'html', subdir: 'html' }, { type: 'text-summary' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: false,
  });
};

const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@assets': 'src/assets',
    '@core': 'src/core',
    '@business': 'src/business',
    '@pages': 'src/pages',
    '@app': 'src/app'
  })(config);

  return config;
};
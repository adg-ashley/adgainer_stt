// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  from: '/src/css/custom.sss',
  to: '/dist/custom.css',
  plugins: [
    // to edit target browsers: use "browserslist" field in package.json
    require('autoprefixer')
  ]
}

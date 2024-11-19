// babel.config.js
module.exports = {
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: [
            '>0.2%',
            'not dead',
            'not op_mini all'
          ]
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }]
    ]
  };
// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'phantomjs-shim', '@angular/cli'],
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-phantomjs-shim'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli', 'coverage']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    junitReporter: {
      outputDir: './reports/junit/',
      outputFile: 'test-results.xml',
      useBrowserName: false
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'junit', 'coverage-istanbul', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};

/*
 * bower-copy.js
 * https://github.com/syeo/bower-copy
 *
 * Copyright (c) 2013 Stanley Yeo
 * Licensed under the MIT license.
 */

var grunt = require('grunt');
var copydep = require('copydep');


/**
 * Developers may still be using "component.json". That's fine, we can use that
 * just the same. But if they are, we'll let them know it's deprecated.
 *
 * @return {object} bower's .json configuration object
 */
var findBowerJSON = function () {

  var bowerJSON;

  ['bower.json', 'component.json'].forEach(function (configFile) {
    if (!bowerJSON && grunt.file.isFile(configFile)) {
      bowerJSON = grunt.file.readJSON(configFile);
    }
  });

  return bowerJSON;
};


/**
 * Try to use a `.bowerrc` file to find a custom directory. If it doesn't exist,
 * we're going with "bower_components".
 *
 * @ return {string} the path to the bower component directory
 */
var findBowerDirectory = function () {

  var directory;

  if (grunt.file.isFile('.bowerrc')) {
    directory = grunt.file.readJSON('.bowerrc').directory;
  }

  if (!directory) {
    ['bower_components', 'components'].forEach(function (dir) {
      if (!directory && grunt.file.isDir(dir)) {
        directory = dir;
      }
    });
  }

  if (!directory || !grunt.file.isDir(directory)) {
    console.log(
      'Cannot find where you keep your Bower packages.'
      + '\n'
      + '\nWe tried looking for a `.bowerrc` file, but couldn\'t find a custom'
      + '\n`directory` property defined. We then tried `bower_components`, but'
      + '\nit looks like that doesn\'t exist either. As a last resort, we tried'
      + '\nthe pre-1.0 `components` directory, but that also couldn\'t be found.'
      + '\n'
      + '\nUnfortunately, we can\'t proceed without knowing where the Bower'
      + '\npackages you have installed are.'
      + '\n'
    );

    grunt.fail.fatal('No Bower components found.');
  }

  return directory;
};


module.exports = function (grunt) {

  grunt.registerMultiTask('bower-copy', 'Copy mains of all components.', function () {
    this.requiresConfig(['bower-copy', this.target, 'target']);
    copydep({
      directory: findBowerDirectory(),
      bowerJson: findBowerJSON(),
      target: this.data.target
    });
  });
};

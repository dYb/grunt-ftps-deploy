/*
 * grunt-ftps-deploy
 * 
 *
 * Copyright (c) 2014 ybduan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    ftps_deploy: {
      deploy: {
        options: {
          auth:{
            host:'61.135.251.132',
            port: 16321,
            authKey: 'key1',
            secure: true
          }
        },
        files: [{
          expand: true,
          cwd:'test',
          src: ['**/*','!**/*.html'],
          dest: '/utf8/3g/dyb'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'ftps_deploy']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};

/*
 * grunt-ftps-deploy
 *
 *
 * Copyright (c) 2014 ybduan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require('fs')
  var Client = require('ftp')

  grunt.registerMultiTask('ftps_deploy', 'Deploy files to ftps server', function() {
    var options = this.options({
      auth:{
        host:'0.0.0.0',
        port: 3000,
        authKey: 'key1',
        secure: false
      },
      silent: false
    });

    options.cwd = this.data.files[0].cwd
    options.src = this.data.files[0].src
    options.dest = this.data.files[0].dest

    var done = this.async()
    var log = function(message) {
      if (options.silent === false) {
        grunt.verbose.write(message);
      }
    }

    if(!grunt.file.exists('.ftppass')){
      grunt.warn('no valid \'.ftppass\' file found!')
    }
    else {
      options.auth.user = JSON.parse(grunt.file.read('.ftppass'))[options.auth.authKey]
    }

    var dirs = [],
        files =[];

    grunt.file.expand({cwd: options.cwd}, options.src).forEach(function(file){
      if (grunt.file.isFile(options.cwd + '/' + file)) {
          log("pushing file: ", file)
          files.push(file)
      } else {
        log("pushing folder: ", file)
        dirs.push(file)
      }
    })

    if(files.length == 0){
      log('No file uploaded!')
      done()
    }

    log("Creating Client");
    var c = new Client()

    c.on('ready',function(){
      log("Client ready", files.length, dirs.length);

      var uploadFile = function(file){
        upload(options.cwd + '/' + file, options.dest + '/' + file)
      }

      dirs.forEach(function(dir){
        preload(dir, function(){
          files.forEach(uploadFile)
        })
      })

      if(dirs.length == 0){
        files.forEach(uploadFile)
      }
    })

    c.connect({
      host: options.auth.host,
      port: options.auth.port,
      user: options.auth.user.username,
      password: options.auth.user.password,
      secure: options.auth.secure,
      secureOptions: {
        requestCert: true,
        rejectUnauthorized: false
      }

    })

    var i = 0,
        j = 0;
    function preload(dir, callback){
      log("preload: ", dir);
      c.list(options.dest + '/' + dir, function(err, list){
        if (typeof list === 'undefined'){
          c.mkdir(options.dest + '/' + dir, true, function(err){
            if(err) {
              throw({
                error: 'Create directory error!',
                dir: dir
              })
            }
            grunt.log.ok('created directory: ',dir);
            if(j == dirs.length){
              callback();
            }
          })
        } else {
          log('directory: ', dir, ' exists');
        }
        j++;
        if(j == dirs.length){
          callback();
        }
      })
    }

    function upload(origin, remote){
      log("starting file: ", origin);
      c.put(origin, remote, function(err){
        if(err) {
          throw({
            error: 'uploading file error',
            file: origin,
            e: err
          })
        }
        i++;
        log("uploaded: ", origin);
        if(i == files.length){
          c.end()
          grunt.log.ok("upload Done!")
          done()
        }
      })
    }
  });

};

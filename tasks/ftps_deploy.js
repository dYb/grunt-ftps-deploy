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
      }
    });
    options.cwd = this.data.files[0].cwd
    options.src = this.data.files[0].src
    options.dest = this.data.files[0].dest
    var done = this.async()
    if(!grunt.file.exists('.ftppass')){
      grunt.warn('no valid \'.ftppass\' file found!')
    }
    options.auth.user = JSON.parse(grunt.file.read('.ftppass'))[options.auth.authKey]

    var dirs = [],
        files =[];
    grunt.file.expand({cwd: options.cwd},options.src).forEach(function(file){
      if (grunt.file.isFile(options.cwd + '/' + file)) {
          if (options.silent === false) {
              console.log("pushing file: ", file);
          }
          files.push(file)
      } else {
          if (options.silent === false) {
              console.log("pushing folder: ", file);
          }
          dirs.push(file)
      }
    })
    if(files.length == 0){
      console.log('No file uploaded!')
      done()
    }
    var c = new Client()
    c.on('ready',function(){
      dirs.forEach(function(dir){
        preload(dir, function(){
          files.forEach(function(file){
            upload(options.cwd + '/' + file, options.dest + '/' + file)
          })
        })
      })
      if(dirs.length == 0){
        files.forEach(function(file){
          upload(options.cwd + '/' + file, options.dest + '/' + file)
        })
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
      c.mkdir(options.dest + '/' + dir, function(){
        j++;
        if(j == dirs.length){
          callback()
        }
      })
    }

    function upload(origin, remote){
      c.put(origin, remote, function(err){
        i++
        if(i == files.length){
          c.end()
          console.log("upload Done!")
          done()
        }
      })
    }


  });

};

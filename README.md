# grunt-ftps-deploy

> Deploy files to ftps server

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ftps-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ftps-deploy');
```

## The "ftps_deploy" task

### Overview
In your project's Gruntfile, add a section named `ftps_deploy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ftps_deploy: {
    deploy: {
      options: {
        auth:{
          host:'0.0.0.0',
          port: 3000,
          authKey: 'key1',
          secure: true
        }
      },
      files: [{
        expand: true,
        cwd:'app',
        src: ['**/* ', '!**/*.html'],
        dest: '/utf8/3g/dyb/test'
      }]
    }
  }
})

```

.ftppass
```json
{
  "key1": {
    "username": "ybduan",
    "password": "password"
  }
}
```

### Others

* Touch a file named `.ftppass` that contains your ftp username and password
* If you are using ftp over SSL,  `secure` must be true
* Make sure path in `files.dest` are already exsit

### Q&A
When you are pushing files to sftp, and meet with the following problem on windows

```
unable to load config info from /usr/local/ssl/openssl.cnf
```

plz download [openssl](http://slproweb.com/products/Win32OpenSSL.html) first, and set this environment variable 
`OPENSSL_CONF=C:\OpenSSL-Win32\bin\openssl.cfg`  for X86
`OPENSSL_CONF=C:\OpenSSL-Win64\bin\openssl.cfg`  for X64



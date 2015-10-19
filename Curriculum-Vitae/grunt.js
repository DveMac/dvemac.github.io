/*global module:false*/
var md = require( "markdown" ).markdown,
    fs = require('fs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      banner: '/*! PROJECT_NAME - v0.1.0 - 2012-04-08\n' +
        '* Copyright (c) 2012 YOUR_NAME; Licensed MIT %> */'
    },
    lint: {
      files: ['grunt.js']
    },
    test: {
      files: ['test/**/*.js']
    },
    concat: {
      dist: {
        src: ['header.html','cv.html','footer.html'],
        dest: 'index.html'
      }
    },
    min: {
      dist: {
        src: ['<banner>', '<config:concat.dist.dest>'],
        dest: 'dist/FILE_NAME.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'compile concat'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    uglify: {}
  });


  grunt.task.registerTask('compile', 'Compile markdown', function() {
    var src = fs.readFileSync('./cv.md', 'UTF8'),
        op = md.toHTML(src);
    fs.writeFileSync('./cv.html',op);

  });


  // Default task.
  grunt.registerTask('default', 'compile concat');

};

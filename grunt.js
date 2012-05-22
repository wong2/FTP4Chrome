/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    coffee: {
        all: {
            src: 'coffee/*.coffee',
            dest: 'js/'
        }
    },
    watch: {
        coffee: {
            files: '<config:coffee.all.src>',
            tasks: 'coffee'
        }
    }
  });

};

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),

    tmpDir: 'transformed',

    // Metadata.
    meta: {
      version: '<%= pkg.version %>'
    },

    banner: '// Release <%= meta.version %>\n',

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false
      }
    },

    // Task configuration.
    browserify: {
      dist: {
        files: {
          '<%= tmpDir %>/viewer.js': ['src/Viewer.es6'],
          '<%= tmpDir %>/editor.js': ['src/Editor.es6']
        },
        options: {
          browserifyOptions: {
            paths: ['./node_modules','./src'],
            basedir: './src'
          },

          transform: ['babelify', 'browserify-shim'],
          shim: {
            fermata: {
              path: './node_modules/fermata/fermata.js',
              exports: 'fermata'
            }
          },
          external: [
            './node_modules/fermata/fermata.js'
          ]
        }
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },

      library: {
        src: ['node_modules/fermata/fermata.js'],
        dest: '<%= tmpDir %>/lib.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        sourceMap: false
      },

      dist: {
        files: {
          'dist/lib.min.js' : ['transformed/lib.js'],
          'dist/editor.min.js' : ['transformed/editor.js'],
          'dist/viewer.min.js' : ['transformed/viewer.js']
        }
      }
    },

    watch: {
      compiled: {
        files: ['src/**/*.es6'],
        tasks: ['compile']
      }
    },

    clean: ['<%= tmpDir %>']
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', ['compile', 'watch']);
  grunt.registerTask('compile', ['concat:library', 'browserify', 'uglify', 'clean']);

  grunt.registerTask('do-release-patch', ['bump:patch', 'compile']);
  grunt.registerTask('do-release-minor', ['bump:minor', 'compile']);
  grunt.registerTask('do-release-major', ['bump:major', 'compile']);
};

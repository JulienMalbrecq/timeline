/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    banner: '<%= grunt.template.today("yyyy-mm-dd") %>\n',

    // Task configuration.
    browserify: {
      dist: {
        files: {
          'dist/app.js': ['src-es6/**/*.es6']
        },
        options: {
          browserifyOptions: {
            paths: ['./node_modules','./src-es6'],
            basedir: './src-es6'
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
        dest: 'dist/lib.js'
      }
    },

    uglify: {
      options: {
        banner: '// <%= banner %>',
        sourceMap: true,
        sourceMapIn: 'dist/app.js.map'
      },

      dist: {
        files: {
          'lib.min.js' : ['dist/lib.js'],
          'app.min.js' : ['dist/app.js']
        }
      }
    },

    watch: {
      compiled: {
        files: ['src-es6/**/*.es6'],
        tasks: ['compile']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['compile', 'watch']);
  grunt.registerTask('compile', ['browserify', 'concat:library', 'uglify']);
};

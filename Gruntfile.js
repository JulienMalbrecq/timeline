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
          'dist/app.js': ['compiled/**/*.js']
        },
        options: {
          debug: false,
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
      },

      timeline: {
        src: ['compiled/**/*.js'],
        dest: 'dist/app.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },

      dist: {
        files: {
          'lib.min.js' : ['dist/lib.js'],
          'app.min.js' : ['dist/app.js']
        }
      }
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
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
	  timeline: {
		  src: 'compiled/**/*.js'
	  }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      compiled: {
        files: ['compiled/**/*.js'],
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

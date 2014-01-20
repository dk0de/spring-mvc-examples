'use strict';

module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Simple file banner
		banner: '/*!\n' +
				' * Exacode-webstrap v<%= pkg.version %>-<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
				' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
				' *\n' +
				' * Designed and built by @pmendelski.\n' +
				' */\n\n',
		// configurable paths
		app: {
			dir: {
				src: 'src/main/grunt',
				lib: 'src/main/grunt/lib',
				tmp: 'target/grunt/tmp',
				dist: 'src/main/webapp/assets',
			},
			path: {
				dev: '/spring-mvc-freemarker-gruntjs',
				prod: ''
			}
		},
		clean: {
			dist: ['<%= app.dir.dist %>'],
			tmp: ['<%= app.dir.tmp %>']
		},
		jshint: {
			options: {
				jshintrc: '<%= app.dir.src %>/js/.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: ['<%= app.dir.src %>/js/**.js']
		},
		cssmin: {
			options: {
				report: 'min'
			},
			combine: {
				files: {
					'<%= app.dir.tmp %>/css/main.css': [
						'<%= app.dir.src %>/css/**/*.css'
					]
				}
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: false
			},
			js: {
				src: [
					'<%= app.dir.lib %>/modernizr/modernizr.js',
					'<%= app.dir.lib %>/jquery/jquery.js',
					'<%= app.dir.lib %>/sass-bootstrap/dist/js/bootstrap.js',
					'<%= app.dir.lib %>/angular/angular.js',
					'<%= app.dir.lib %>/purl/purl.js',
					'<%= app.dir.src %>/js/main.js'
					// Add other js files
				],
				dest: '<%= app.dir.dist %>/js/main.js'
			},
			'css-prod': {
				src: [
					'<%= app.dir.tmp %>/scss/main.css',		// css from compass compilation
					'<%= app.dir.tmp %>/css/main.css'		// minified additional css (see: cssmin)
				],
				dest: '<%= app.dir.dist %>/css/main.css'
			},
			'css-dev': {
				src: [
					'<%= app.dir.tmp %>/scss/main.css',	// css from compass compilation
					'<%= app.dir.src %>/css/**/*.css'	// additional css files (not processed)
				],
				dest: '<%= app.dir.dist %>/css/main.css'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			build: {
				src: ['<%= app.dir.dist %>/js/main.js'],
				dest: '<%= app.dir.dist %>/js/main.min.js'
			}
		},
		imagemin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= app.dir.src %>', 
					src: 'img/**/*.{gif,jpeg,jpg,png}',
					dest: '<%= app.dir.dist %>'
				}]
			}
		},
		svgmin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= app.dir.src %>', 
					src: 'img/**/*.svg',
					dest: '<%= app.dir.dist %>/img'
				}]
			}
		},
		copy: {
			'additional-images': {
				files: [{
					expand: true,
					flatten: true,
					dest: '<%= app.dir.dist %>/img',
					src: [ 
							// add some images to copy
					]
				}]
			},
			'images-dev': {
				files: [{
					expand: true,
					cwd: '<%= app.dir.src %>',
					dest: '<%= app.dir.dist %>',
					src: [ 'img/**/*.*']
				}]
			},
			fonts: {
				files: [{
					expand: true, 
					flatten: true, 
					src: ['<%= app.dir.lib %>/font-awesome/fonts/*'], 
					dest: '<%= app.dir.dist %>/fonts/font-awesome'
				}, {
					expand: true,
					cwd: '<%= app.dir.src %>/fonts',
					dest: '<%= app.dir.dist %>/fonts',
					src: ['**/*.*']
				}]
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 1 version'] // more codenames at https://github.com/ai/autoprefixer#browsers
			},
			build: {
				files: [{
					src: '<%= app.dir.dist %>/css/**/*.css'
				}]
			}
		},
		compass: {
			options: {
				// define input directories
				importPath: '<%= app.dir.lib %>',		// where to search when using '@import'
				sassDir: '<%= app.dir.src %>/scss',		// where are .scss fiels?
				imagesDir: '<%= app.dir.src %>/img',	// where are images? ...handy when generating sprites
				fontsDir: '<%= app.dir.src %>/fonts',	// where are all fonts
				// define outout directories
				generatedImagesDir: '<%= app.dir.dist %>/img/generated',	// where to put generated images? e.g. sprites
				cssDir: '<%= app.dir.tmp %>/scss',	// where to put generated css?
				// define build parameters
				trace: true,
				relativeAssets: true,
				raw: "cache_path = '<%= app.dir.tmp %>/scss/cache'\n"
			},
			dev: {
				options: {
					environment: 'development',
					outputStyle: 'expanded',
					httpPath: '<%= app.path.dev %>',
					httpImagesPath: '<%= app.path.dev %>/img',
					httpGeneratedImagesPath: '<%= app.path.dev %>/assets/img/generated',
					httpFontsPath: '<%= app.path.dev %>/fonts',
					httpStylesheetsPath: '<%= app.path.dev %>/css'
				}
			},
			prod: {
				options: {
					environment: 'production',
					outputStyle: 'compressed',
					httpPath: '<%= app.path.prod %>/',
					httpImagesPath: '<%= app.path.prod %>/img',
					httpGeneratedImagesPath: '<%= app.path.prod %>/assets/img/generated',
					httpFontsPath: '<%= app.path.prod %>/fonts',
					httpStylesheetsPath: '<%= app.path.prod %>/css'
				}
			}
		},
		watch: {
			resources: {
				files: [
					'<%= app.dir.src %>/img/**/*.*', 
					'<%= app.dir.src %>/fonts/**/*.*'
				],
				tasks: ['dist-resources-fast']
			},
			sass: {
				files: ['<%= app.dir.src %>/sass/**/*.{scss,sass}'],
				tasks: ['dist-css-fast']
			},
			js: {
				files: ['<%= app.dir.src %>/js/**/*.js'],
				tasks: ['dist-js-fast']
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "path/to/base",
					mainConfigFile: "path/to/config.js",
					name: "path/to/almond", // assumes a production build using almond
					out: "path/to/optimized.js"
				}
			}
		},
		karma: {
      ci: {
        configFile: '<%= app.dir.src %>/js/test/karma.conf.js',
        browsers  : ['PhantomJS'],
        singleRun : true
      },
      unit: { // start testing server that listens for code updates
        autoWatch : true,
        configFile: 'karma.conf.js',
        singleRun : false,
        browsers  : ['PhantomJS']
      },
      unitSingleRun: {
        autoWatch : false,
        configFile: 'karma.conf.js',
        singleRun : true,
        browsers  : ['PhantomJS']
      },
      watch: { // used in grunt watch context
        background: true,
        configFile: 'karma.conf.js',
        singleRun : false,
        browsers  : ['Chrome']
      }
    }
	});

	// Distribution - JavaScript
	grunt.registerTask('js-test', ['jshint', 'qunit']);
	grunt.registerTask('js-dev', ['concat:js_fast']);
	grunt.registerTask('js-prod', [
		'test-js', 		// run tests
		'concat:js', 	// concatenate js files
		'uglify'		// uglify files
	]);

	// Distribution - CSS
	grunt.registerTask('css-dev', ['compass:dev', 'concat:css-dev', 'autoprefixer']);
	grunt.registerTask('css-prod', [
		'compass:prod', 	// compile compass
		'cssmin', 			// minify additional css
		'concat:css-prod', 	// concatenate compass css with additional css
		'autoprefixer'		// add apropriate prefixes to css rules
	]);

	// Distribution - Additional resources (images, fonts etc.)
	grunt.registerTask('resources-dev', ['copy:images-dev', 'copy:additional-images', 'copy:fonts']);
	grunt.registerTask('resources-prod', [
		'imagemin', 				// minimize images of type png, jpg
		'svgmin', 					// minimize svg images
		'copy:additional-images', 	// copy additional images
		'copy:fonts'				// copy fonts
	]);

	// Build
	grunt.registerTask('build-prod', ['css-prod', 'resources-prod', 'js-prod']);
	grunt.registerTask('build-dev', ['css-dev', 'resources-dev', 'js-dev']);

	// Default task.
	grunt.registerTask('default', ['clean', 'build-prod']);

};

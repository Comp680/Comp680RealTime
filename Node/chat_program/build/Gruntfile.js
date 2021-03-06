/**
 * New node file
 */

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
				pkg : grunt.file.readJSON('package.json'),

				concat : {
					socket_js : {
						files : [ {
							src : [ 'controller/server_sockets.js',
									'controller/socket_rooms.js' ],
							dest : 'controller/new_server_sockets.js'
						} ],
					}

				},
				copy : {
					templates : {

						files : [ {
							expand : true,
							cwd:'routes',
							src : ['**/*'],
							dest : 'build/routes/'
						},
						{
							expand : true,
							cwd:'views',
							src : ['**/*'],
							dest : 'build/views/'
						},
						{
							expand : true,
							src : ['*.js'],
							dest : 'build/',
							filter:'isFile'
						},
						{
							expand : true,
							cwd:'bin',
							src : ['*','**/*'],
							dest : 'build/bin/',
							filter:'isFile'
						}
						

						]
					}

				},

				uglify : {
					options : {
						banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
					},
					build : {
						src : 'public/javascript/chat_front.js',
						dest : 'build/public/javascript/chat_front.min.js'
					}
				},
				
				cssmin:{
					
						  target: {
							files: [{
							  expand: true,
							  cwd: 'public/stylesheets',
							  src: ['*.css', '!*.min.css'],
							  dest: 'build/public/stylesheets/',
							  ext: '.min.css'
							}]
						  }
						
				},

				clean : {
					foo : {
						src : [ 'build/*' ],
					},
				}

			});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	// Default task(s).
	grunt.registerTask('default', [ 'concat', 'copy', 'uglify','cssmin' ]);
	grunt.registerTask('clean', [ 'clean' ]);

};
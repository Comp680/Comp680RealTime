/**
 * New node file
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat:{
    	socket_js: {
    		files: [
    		        {src: 
    		        	['controller/server_sockets.js', 
    		        	 'contoller/socket_rooms.js'], 
    		        	 dest: 'build/controller/server_sockets.js'}
    		      ],
    	}
    	
    },
    copy:{
    	src:'*',
    	dest:'build',
    	filter:'isFile'
    	
    },
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/javascript/chat_front.js',
        dest: 'build/chat_front.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Default task(s).
  grunt.registerTask('default', ['concat','copy','uglify']);

};
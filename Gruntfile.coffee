module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  grunt.file.readJSON('package.json')
  
  CORE_PATH = 'node_modules/comment-core-library/build'
  CORE_FILES = [
    'CommentCoreLibrary.min.js'
  ]
  ABP_JS_FILES = [
    'build/js/ABPMobile.js'
    'build/js/ABPLibxml.js'
    'build/js/ABPlayer.js'
  ]
  grunt.initConfig(
    # Copy
    copy:
      default:
        files:[
          {expand: true, cwd:"src/css/", src:['ext/styles.css','*'], dest:'build/css/'}
          {expand: true, cwd: CORE_PATH , src: CORE_FILES,  dest:'build/js/'}
          {expand: true, cwd:'src/js/', src: ['*.js'],  dest:'build/js/'}
          {expand: true, cwd:'src/', src: ['*.html', '*.xml'],  dest:'build/'}
          {expand: true, cwd:'src/demos', src: ['*/*'],  dest:'build/demos/'}
        ]
    
    # Auto-prefix CSS properties using Can I Use?
    autoprefixer:
      options:
        browsers: ['last 3 versions', 'bb 10', 'android 3']

      no_dest:
        # File to output
        src: ['build/css/base.css','build/css/ext/styles.css']

    # Minify CSS
    cssmin:
      minify:
        src: ['build/css/base.css']
        dest: 'build/css/base.min.css'

    uglify:
      all:
        files:
          'build/js/ABPlayer.min.js': ABP_JS_FILES
  )

  # Register our tasks
  grunt.registerTask 'dist', ['copy', 'uglify', 'autoprefixer', 'cssmin']
  grunt.registerTask 'default', ['dist']


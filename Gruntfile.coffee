module.exports = (grunt) ->
  require('load-grunt-tasks') grunt
  grunt.file.readJSON('package.json')
  
  VENDOR_PATH = 'node_modules/comment-core-library/dist'
  VENDOR_FILES = [
    'CommentCoreLibrary.min.js'
  ]

  CORE_JS_FILES = [
    'src/DetectMobile.js'
    'src/CommentLoader.js'
    'src/Player.js'
  ]

  grunt.initConfig(
    clean:
      dist: ['dist']

    concat:
      default:
        files:
          'dist/ABPlayerHTML5.js': CORE_JS_FILES
    # Copy
    copy:
      default:
        files:[
          {expand: true, cwd:"src/css/", src:['*'], dest:'dist/css/'}
          {expand: true, cwd: VENDOR_PATH , src: VENDOR_FILES, dest:'dist/vendor/'}
        ]
    
    # Auto-prefix CSS properties using Can I Use?
    postcss:
      options:
        processors: [
          require('autoprefixer')
        ]
      dist:
        # File to output
        src: 'dist/css/*.css'

    # Minify CSS
    cssmin:
      minify:
        src: ['dist/css/base.css']
        dest: 'dist/css/base.min.css'

    uglify:
      all:
        files:
          'dist/ABPlayerHTML5.min.js': ['dist/ABPlayerHTML5.js']
  )

  grunt.loadNpmTasks 'grunt-postcss'

  # Register our tasks
  grunt.registerTask 'dist', ['clean', 'concat', 'copy', 'uglify', 'postcss', 'cssmin']
  grunt.registerTask 'default', ['dist']

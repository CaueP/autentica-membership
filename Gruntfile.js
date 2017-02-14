module.exports = function(grunt) {

    grunt.initConfig({
        jshint : {
            files : ['lib/**/*js', 'models/**/*.js']
        },
        // setting up Grunt Watch
        watch : {
            files: ['lib/**/*js', 'models/**/*.js'],
            tasks: ['jshint']
        }
    });
    
    // loading jshint task of the instaled module 
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // loading watch task of the instaled module
    grunt.loadNpmTasks("grunt-contrib-watch");
}
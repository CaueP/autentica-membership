var db = require("secondthought");
var assert = require("assert");

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

    grunt.registerTask("installDb", function() {
        var done = this.async();
        db.connect({db: "membership"}, function(err,db){
            db.install(['users', 'logs', 'sessions'], function(err, tableResult){
                assert.ok(err === null, err);
                console.log("DB Installed: " + tableResult);
                done();
            })
        })
    })
    
    // loading jshint task of the instaled module 
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // loading watch task of the instaled module
    grunt.loadNpmTasks("grunt-contrib-watch");
}
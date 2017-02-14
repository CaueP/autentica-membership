var assert = require("assert");

var User = require("../models/user");
var Application = require("../models/application");
var db = require("secondthought");

// registration results
var RegResult = function() {
    var result = {
        success: false,
        message: null,
        user: null
    }

    return result;
};

var Registration = function(db){

    var self = this;

    var validateInputs = function(app){
        //make sure there's an email and password
        if(!app.email || !app.password){
            app.setInvalid("Email and password are required");
        }else if(app.password !== app.confirm){
            app.setInvalid("Passwords don't match");
        }else{
            app.validate();
        }
    }

    var checkIfUserExists = function(app, next){

        db.users.exists({email: app.email}, next);
    };

    self.applyForMembership = function(args, next) {
        var regResult = new RegResult();
        var app = new Application(args);
        
        //validate inputs
        validateInputs(app);
        //validate password and email
        //checo to see if email exists
        checkIfUserExists(app, function(err,exists){
            console.log(exists);
            assert.ok(err === null, err);
            if(!exists){
                // create a new user
                //hash the password
                //create a log entry
                //success
                regResult.success = true;
                regResult.message = "Welcome!";

                regResult.user = new User(args);   
            };
            next(null, regResult);        
        });
    };

    return self;
};

module.exports = Registration;

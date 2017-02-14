var User = require("../models/user");
var Application = require("../models/application");
var db = require("secondthought");
var assert = require("assert");
var bcrypt = require("bcrypt-nodejs");
var Log = require("../models/log");
var Emitter = require("events").EventEmitter;
var util  = require("util");

// registration results
var RegResult = function() {
    var result = {
        success: false,
        message: null,
        user: null
    };

    return result;
};

var Registration = function(db){
    // invoking the event emitter constructor passing 'this', an instance of Registration function
    Emitter.call(this);

    var self = this;

    var continueWith = null;

    var validateInputs = function(app){
        console.log("validateInputs called");
        console.log(app);
        //make sure there's an email and password
        if(!app.email || !app.password){
            app.setInvalid("Email and password are required");
            self.emit("invalid", app);
        }else if(app.password !== app.confirm){
            app.setInvalid("Passwords don't match");
            self.emit("invalid", app);
        }else{
            app.validate();
            self.emit("validated", app);
        }
    };

    var checkIfUserExists = function(app){
        console.log("checkIfUserExists called");

        db.users.exists({email: app.email}, function(err, exists){
            assert.ok(err === null);
            if(exists){
                app.setInvalid("This email already exists");
                self.emit("invalid", app);
            }else{
                self.emit("user-doesnt-exist", app);
            }
        });
    };

    // saves users on the database
    var createUser = function(app){
        console.log("createUser called");
        var user = new User(app);
        user.status = "approved";
        user.signInCount = 1;
        db.users.save(user, function(err, newUser){
            assert.ok(err === null, err);
            app.user = newUser;
            self.emit("user-created", app);
        });
    };

    // add a log entry
    var addLogEntry = function(app){
        console.log("addLogEntry called");
        var log = new Log({
            subject: "Registration",
            userId: app.user.id,
            entry: "Successfully Registered"

        });

        db.logs.save(log, function(err, newLog){
            app.log = newLog;
            self.emit("log-created", app);
        });
    };

    

    self.applyForMembership = function(args, next) {
        console.log("applyForMembership called");
        continueWith = next;
        
        var app = new Application(args);
        self.emit("application-received", app);
    };

    var registrationOk = function(app) {
        console.log("registrationOk called");
        var regResult = new RegResult();
        regResult.success = true;
        regResult.message = "Welcome!";
        regResult.user = app.user;
        regResult.log = app.log;
        
        if(continueWith){
            continueWith(null, regResult);
        }
    };

    var registrationNotOk = function(app) {
        console.log("registrationNotOk called");
        var regResult = new RegResult();
        regResult.success = false;
        regResult.message = app.message;
        
        if(continueWith){
            continueWith(null, regResult);
        }
    };

    //event wiring
    self.on("application-received", validateInputs);
    self.on("validated", checkIfUserExists);
    self.on("user-doesnt-exist", createUser);
    self.on("user-created", addLogEntry);
    self.on("log-created", registrationOk);

    //something went wrong
    self.on("invalid", registrationNotOk);

    return self;
};

// inserting event emitter prototype onto Registration prototype (it's a way to do inheritance in a classless language like JS)
util.inherits(Registration, Emitter);
module.exports = Registration;

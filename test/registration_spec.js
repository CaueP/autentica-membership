var Registration = require("../lib/registration");
var db = require("secondthought");

describe("Registration", function() {
    var reg = {};
    before(function(done) {
        db.connect({db: "membership"}, function(err, db) {
            reg = new Registration(db);
            done(); // called when this function is done, then move forward. Avoid assynchronous problems, such as connecting to db
        });
    })
    // happy path
    describe("a valid application", function() {
        var regResult = {};
        before(function(done) {
            db.users.destroyAll(function(err, results){
                reg.applyForMembership({
                    email: "caue.polimanti@gmail.com", 
                    password: "password", 
                    confirm: "password"}, function(err, result) {
                        regResult = result;
                        done();
                    });
            });

        });
        it("is successful", function() {
            regResult.success.should.equal(true);
        });
        it("creates a user", function() {
           regResult.log.should.be.defined;
        });
        it("creates a log entry", function(){
            regResult.log.should.be.defined;
        });
        it("sets the user's status to be approved", function(){
            regResult.user.status.should.equal("approved");
        });
        it("offers a welcome message", function(){
            regResult.message.should.equal("Welcome!");
        });
        it("increments the signInCount", function(){
            regResult.user.signInCount.should.equal(1);
        });
    });

    describe("an empty or null email", function() {
        it("is not successful");
        it("tells user that email is required");
    });

    describe("empty or null password", function() {
        it("is not successful");
        it("tells user that password is required");
    });

    describe("password and confirm mismatch", function() {
        it("is not successful");
        it("tells user that passwords don't match");
    });

    describe("email already exists", function() {
        it("is not successful");
        it("tells user that email already exists");
    });
});
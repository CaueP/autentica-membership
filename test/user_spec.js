var should = require("should");
var User = require("../models/user")

// describe block of a feature, or subject of testing
describe("User", function(){
    // aspect of the feature being tested
    describe("defaults", function(){
        var user = {};
        before(function(){
            user = new User({email: "caue@cauep.com"});
        });                    

        it("email is caue@cauep.com", function(){
            user.email.should.equal("caue@cauep.com");
        });
        it("has an authentication token", function(){
            user.authenticationToken.should.be.defined;
        });
        it("has a pending status", function(){
            user.status.should.equal("pending");
        });
        it("has a created date", function(){
            user.createdAt.should.be.defined;
        });
        it("has a signInCount of 0", function(){
            user.signInCount.should.equal(0);
        });
        it("has lastLogin", function(){
            user.lastLoginAt.should.be.defined;
        });
        it("has currentLogin", function(){
            user.currentLoginAt.should.be.defined;
        });
    });
});
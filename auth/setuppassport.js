var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var params = require("../params/params");
var db = require("../models/createdatabase");

module.exports = function(){
    var User = db.User;
    var UserCheckPassword = db.UserCheckPassword;
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done){
        var user = await User.findOne({where: {id: id}});
        done(null, user);
    });

    passport.use("login", new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback : true
    }, async function(req, username, password, done){
        var user = await User.findOne({where: {username: username}});
        if(!user) return done(null, false, req.flash("error", "Tên đăng nhập không tồn tại"));
        UserCheckPassword.checkPassword(User, username, password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                params.currentUserId = user.id;
                params.currentRole = user.roleId;
                if(user.statusId == 2) return done(null, false, req.flash("error", "Tài khoản này đã bị ban!"));
                else return done(null, user);
            }
            else return done(null, false, req.flash("error", "Sai mật khẩu!"));
        });
    }));
};
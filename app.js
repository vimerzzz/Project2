var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");

var indexRouter = require('./routes/index');
var setUpPassport = require("./auth/setuppassport");
var db = require("./models/createdatabase");
var initial = require('./models/initial');
var relationship = require("./models/relationship");

var app = express();

app.set("port", 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "nfviwnkdhfewkn1fnw!fbwefnef",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use('/', indexRouter);
app.get("*", function(req, res){
    res.render("home/404");
});

app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
});

relationship();
db.sequelize.sync().then(async function(){
    initial();
});
setUpPassport();

module.exports = app;
var express = require('express');

var params = require("../params/params");

var router = express.Router();

router.use(function(req, res, next){
    res.locals.title = "";
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.errorChangePassword = req.flash("errorChangePassword");
    res.locals.info = req.flash("info");
    res.locals.role = params.currentRole;
    if((req.originalUrl != "/login") && (req.originalUrl != "/signup") && (req.originalUrl != "/logout") && (req.originalUrl != "/logged") && (req.originalUrl != "/favicon.ico")){
        params.currentUrl = req.originalUrl;
    }
    res.locals.hasShop = params.hasShop;
    next();
});

router.use("/", require("./home"));

router.use("/information", require("./information"));

router.use("/order", require("./order"));

router.use("/purchase", require("./purchase"));

router.use("/shop", require("./shop"));

module.exports = router;

var params = require("../params/params");

var ensureAuth = function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash("info", "Bạn phải đăng nhập để có thể xem được trang này!");
        res.redirect("/login");
    }
};

var blockAdmin = function blockAdminRole(req, res, next){
    var role = params.currentRole;
    if(role == 1){
        req.flash("info", "Bạn không có quyền xem trang này!");
        res.redirect("/blank");
    }
    else next();
}

var blockCustomer = function blockCustomerRole(req, res, next){
    var role = params.currentRole;
    if(role == 2){
        req.flash("info", "Bạn không có quyền xem trang này!");
        res.redirect("/blank");
    }
    else next();
}

var blockDeliver = function blockDeliverRole(req, res, next){
    var role = params.currentRole;
    if(role == 3){
        req.flash("info", "Bạn không có quyền xem trang này!");
        res.redirect("/blank");
    }
    else next();
}

module.exports = {
    ensureAuthenticated: ensureAuth,
    blockAdminRole: blockAdmin,
    blockCustomerRole: blockCustomer,
    blockDeliverRole: blockDeliver
}
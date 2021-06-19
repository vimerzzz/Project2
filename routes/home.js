var express = require("express");
var db = require("../models/createdatabase");
var passport = require("passport");
var bcrypt = require("bcryptjs");
var validator = require("validator");

var User = db.User;
var UserInfo = db.UserInfo;
var Shop = db.Shop;
var Follow = db.Follow;
var Item = db.Item;
var Category = db.Category;
var Cart = db.Cart;
var Op = db.Op;

var router = express.Router();

var params = require("../params/params");
var initial = require("../models/initial");

router.get("/", async function(req, res){
    res.locals.title = "Home";

    var shops = await Shop.findAll({
        include: [{
            model: Item
        }, {
            model: User
        }],
        order:[
            ["id", "DESC"],
            [Item, "count", "DESC"]
        ]
    });

    var tmp = "";
    var tmpA = [];

    for(var shop of shops){
        for(var item of shop.items){
            tmp = item.image;
            tmpA = tmp.split("\\");
            item.image = tmpA[1] + "/" + tmpA[2];

            item.price = item.price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            item.priceDiscount = item.priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        }
    }

    res.render("home/home", {
        shops: shops
    });
});

router.get("/search", async function(req, res){
    res.locals.title = "Tìm kiếm";
    
    var search = req.query.search;

    var shops = await Shop.findAll({
        include: [{
            model: Item,
            where: {
                itemName:{
                    [Op.substring]: search
                }
            }
        }, {
            model: User
        }],
        order:[
            ["id", "DESC"],
            [Item, "count", "DESC"]
        ]
    });
    var tmp = "";
    var tmpA = [];

    for(var shop of shops){
        for(var item of shop.items){
            tmp = item.image;
            tmpA = tmp.split("\\");
            item.image = tmpA[1] + "/" + tmpA[2];

            item.price = item.price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            item.priceDiscount = item.priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        }
    }

    res.render("home/search", {
        shops: shops
    });
});

router.get("/blank", function(req, res){
    res.locals.title = "Error";
    res.render("home/blank");
});

router.get("/login", function(req, res){
    res.locals.title = "Login";
    if(res.locals.currentUser) res.redirect("/");
    res.render("home/login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/logged",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logged", async function(req, res){
    await initial();
    res.redirect(params.currentUrl);
});

router.get("/logout", function(req, res){
    req.logout();
    params.currentUserId = 0;
    res.redirect(params.currentUrl);
});

router.get("/signup", function(req, res){
    res.locals.title = "Signup";
    if(res.locals.currentUser) res.redirect("/");
    res.render("home/signup");
});

router.post("/signup", async function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var rePassword = req.body.rePassword;
    username = username.trim();
    email = email.trim();
    password = password.trim();
    rePassword = rePassword.trim();

    if(!username){
        req.flash("error", "Chưa điền tên tài khoản!");
        return res.redirect("/signup");
    }

    if(!email){
        req.flash("error", "Chưa điền email!");
        return res.redirect("/signup");
    }

    if(!validator.isEmail(email)){
        req.flash("error", "Email không đúng cú pháp!");
        return res.redirect("/signup");
    }

    if(!password){
        req.flash("error", "Chưa điền mật khẩu!");
        return res.redirect("/signup");
    }

    if(!rePassword){
        req.flash("error", "Chưa điền mật khẩu xác nhận!");
        return res.redirect("/signup");
    }
    
    if(password !== rePassword){
        req.flash("error", "Mật khẩu không khớp!");
        return res.redirect("/signup");
    }

    var user = await User.findOne({where: {username: username}});
    if(user){
        req.flash("error", "Tên tài khoản " + username + " đã tồn tại!");
        return res.redirect("/signup");
    }
    
    var user = await User.findOne({where: {email: email}});
    if(user){
        req.flash("error", "Email " + email + " đã được đăng ký!");
        return res.redirect("/signup");
    }

    var salt = bcrypt.genSaltSync(10);
    var userId = 0;

    try{
        var newUser = await User.create({
            roleId: 2,
            statusId: 1,
            username: username,
            email: email,
            password: bcrypt.hashSync(password, salt)
        });
        userId = newUser.id;
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    try{
        await UserInfo.create({
            userId: userId,
            hasShop: 0,
            totalAddress: 0,
            totalFollow: 0,
            totalOrder: 0
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    req.flash("info", "Đã đăng ký thành công! Vui lòng đăng nhập để tiếp tục!");
    res.redirect("/login");
});

var urlTmp = "";
router.get("/user/:username", async function(req, res){
    var user = await User.findOne({
        where: {username: req.params.username},
        include:[{
            model: UserInfo
        }, {
            model: Shop
        }]
    });
    if(user){
        urlTmp = "/user/".concat(user.username);
        var currentFollow = 0;
        if(params.currentUserId){
            var checkCurrentFollow = await User.findOne({
                include:[{
                    model: Follow,
                    where:{
                        userId: params.currentUserId,
                        shopId: user.shop.id
                    }
                }]
            });
            if(!checkCurrentFollow){
                currentFollow = 0;
            }
            else{
                currentFollow = 1;
            }
        }

        if(user.userinfo.hasShop == 0){
            req.flash("info", "Hiện người dùng này chưa có shop!");
            return res.redirect("/blank");
        }

        var items = await Item.findAll({
            where: {shopId: user.shop.id},
            order:[
                ["count", "DESC"]
            ]
        });

        res.locals.title = user.shop.shopName;

        var tmp = user.shop.image;
        var tmpA = tmp.split("\\");
        var image = tmpA[1] + "/" + tmpA[2];
        
        tmp = user.shop.createdAt;
        tmpA = tmp.split("-");
        var createdAt = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

        for(var item of items){
            item.price = item.price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            item.priceDiscount = item.priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            tmp = item.image;
            tmpA = tmp.split("\\");
            item.image = tmpA[1] + "/" +tmpA[2];
        }

        res.render("home/preview", {
            user: user,
            image: image,
            createdAt: createdAt,
            currentFollow: currentFollow,
            items: items
        });
    }
    else{
        res.render("home/404");
    }
});

router.post("/user/addFollow/:shopId", async function(req, res){
    params.currentUrl = urlTmp;
    if(!params.currentUserId){
        req.flash("error", "Bạn phải đăng nhập để có thể thực hiện được chức năng này!");
        return res.json({
            tokenError: true
        });
    }
    else{
        try{
            await Follow.create({
                userId: params.currentUserId,
                shopId: req.params.shopId
            });
        }
        catch(err){
            if(err) console.log(err);
            res.status(500).send("Internal Server Error");
        }

        var currentUserInfo = await UserInfo.findOne({where: {userId: params.currentUserId}});
        try{
            await UserInfo.update({
                totalFollow: currentUserInfo.totalFollow + 1
            }, {where: {userId: params.currentUserId}});
        }
        catch(err){
            if(err) console.log(err);
            res.status(500).send("Internal Server Error");
        }

        var currentShop = await Shop.findOne({where: {id: req.params.shopId}});
        try{
            await Shop.update({
                totalFollower: currentShop.totalFollower + 1
            }, {where: {id: req.params.shopId}});
        }
        catch(err){
            if(err) console.log(err);
            res.status(500).send("Internal Server Error");
        }
        return res.json({
            tokenError: false
        });
    }
});

router.post("/user/removeFollow/:shopId", async function(req, res){
    params.currentUrl = urlTmp;
    if(!params.currentUserId){
        req.flash("error", "Bạn phải đăng nhập để có thể thực hiện được chức năng này!");
        return res.json({
            tokenError: true
        });
    }
    else{
        try{
            await Follow.destroy({where:{
                userId: params.currentUserId,
                shopId: req.params.shopId
            }});
        }
        catch(err){
            if(err) console.log(err);
            res.status(500).send("Internal Server Error");
        }

        var currentUserInfo = await UserInfo.findOne({where: {userId: params.currentUserId}});
        try{
            await UserInfo.update({
                totalFollow: currentUserInfo.totalFollow - 1
            }, {where: {userId: params.currentUserId}});
        }
        catch(err){
            if(err) console.log(err);
            res.status(500).send("Internal Server Error");
        }

        var currentShop = await Shop.findOne({where: {id: req.params.shopId}});
        try{
            await Shop.update({
                totalFollower: currentShop.totalFollower - 1
            }, {where: {id: req.params.shopId}});
        }
        catch(err){
            if(err) console.log(err);
            res.status(500).send("Internal Server Error");
        }
        return res.json({
            tokenError: false
        });
    }
});

router.get("/item/:itemNameUrl", async function(req, res){
    var item = await Item.findOne({
        where: {itemNameUrl: req.params.itemNameUrl},
        include: [
            {model: Category},
            {
                model: Shop,
                include: {
                    model: User,
                    include: UserInfo
                }
            }
        ]
    });
    if(item){
        var tmp = "";
        var tmpA = [];
        res.locals.title = item.itemName;
        urlTmp = "/item/".concat(item.itemNameUrl);
        
        tmp = item.image;
        tmpA = tmp.split("\\");
        item.image = tmpA[1] + "/" + tmpA[2];

        tmp = item.shop.image;
        tmpA = tmp.split("\\");
        var image = tmpA[1] + "/" + tmpA[2];

        tmp = item.shop.createdAt;
        tmpA = tmp.split("-");
        var createdAt = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];
        
        var discountPercent = item.priceDiscount / item.price * 100;
        if(discountPercent - parseInt(discountPercent) >= 0.5){
            discountPercent = 100 - (parseInt(discountPercent) + 1);
        }
        else{
            discountPercent = 100 - parseInt(discountPercent);
        }
        item.price = item.price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        item.priceDiscount = item.priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });

        res.render("home/viewItem", {
            item: item,
            discountPercent: discountPercent,
            image: image,
            createdAt: createdAt
        });
    }
    else{
        res.render("home/404");
    }
});

router.post("/item/addCart/:itemNameUrl", async function(req, res){
    params.currentUrl = urlTmp;
    if(!params.currentUserId){
        req.flash("error", "Bạn phải đăng nhập để có thể thực hiện được chức năng này!");
        return res.json({
            tokenError: true
        });
    }
    else{
        var number = parseInt(req.body.number);
        var itemNameUrl = req.params.itemNameUrl;

        var item = await Item.findOne({where: {itemNameUrl: itemNameUrl}});
        var existedCart = await Cart.findOne({where: {
            itemId: item.id,
            userId: params.currentUserId
        }});
        if(!existedCart){
            try{
                await Cart.create({
                    itemId: item.id,
                    userId: params.currentUserId,
                    amount: number
                });
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        else{
            number += existedCart.amount;
            try{
                await Cart.update({
                    amount: number
                }, {where: {
                    itemId: item.id,
                    userId: params.currentUserId
                }});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }

        return res.json({
            tokenError: false
        });
    }
});

module.exports = router;
var express = require("express");
var bcrypt = require("bcryptjs");
var validator = require("validator");

var ensureAuthenticated = require("../auth/authPage").ensureAuthenticated;
var blockDeliverRole = require("../auth/authPage").blockDeliverRole;
var blockCustomerRole = require("../auth/authPage").blockCustomerRole;
var blockAdminRole = require("../auth/authPage").blockAdminRole;

var db = require("../models/createdatabase");
var params = require("../params/params");

var User = db.User;
var UserInfo = db.UserInfo;
var Address = db.Address;
var Category = db.Category;
var Attribute = db.Attribute;
var Shop = db.Shop;
var Item = db.Item;
var Follow = db.Follow;
var Role = db.Role;
var Status = db.Status;
var Deliver = db.Deliver;
var Order = db.Order;
var OrderItem = db.OrderItem;
var Notification = db.Notification;
var Op = db.Op;

var router = express.Router();

router.use(ensureAuthenticated);

router.get("/home", async function(req, res){
    res.locals.title = "Thông tin cá nhân";
    var userId = params.currentUserId;

    var user = await UserInfo.findOne({
        where: {userId: userId},
        include: User
    });
    res.render("information/home", {
        username: user.user.username,
        fullName: user.fullName,
        job: user.job,
        sexual: user.sexual,
        workplace: user.workplace,
        otherInformation: user.otherInformation,
        birthday: user.birthday,
        phone: user.phone
    });
});

router.post("/home", async function(req, res){
    var userId = params.currentUserId;
    var fullName = req.body.fullName;
    var birthday = req.body.birthday;
    var phone = req.body.phone;
    var job = req.body.job;
    var workplace = req.body.workplace;
    var sexual = req.body.sexual;
    var otherInformation = req.body.otherInformation;
    fullName = fullName.trim();
    phone = phone.trim();
    job = job.trim();
    workplace = workplace.trim();
    otherInformation = otherInformation.trim();

    if(phone){
        if(!validator.isMobilePhone(phone, "vi-VN")){
            req.flash("error", "Số điện thoại không đúng cú pháp!");
            return res.redirect("/information/home");
        }
    }

    if(birthday){
        try{
            await UserInfo.update({
                fullName: fullName,
                birthday: birthday,
                phone: phone,
                job: job,
                workplace: workplace,
                sexual: sexual,
                otherInformation: otherInformation
            }, {where: {userId: userId}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
    else{
        try{
            await UserInfo.update({
                fullName: fullName,
                phone: phone,
                job: job,
                workplace: workplace,
                sexual: sexual,
                otherInformation: otherInformation
            }, {where: {userId: userId}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    req.flash("info", "Đã lưu thông tin thành công!");
    res.redirect("/information/home");
});

router.get("/notification", async function(req, res){
    res.locals.title = "Thông báo";

    var notifications = await Notification.findAll({
        where: {userId: params.currentUserId},
        order:[
            ["id", "DESC"]
        ]
    });
    var tmp;
    var fullTime = "";
    for(var notification of notifications){
        tmp = notification.createdAt;
        if(tmp.getHours() < 10){
            fullTime += "0" + tmp.getHours().toString() + ":";
        }
        else{
            fullTime += tmp.getHours().toString() + ":";
        }
        if(tmp.getMinutes() < 10){
            fullTime += "0" + tmp.getMinutes().toString() + ":";
        }
        else{
            fullTime += tmp.getMinutes().toString() + ":";
        }
        if(tmp.getSeconds() < 10){
            fullTime += "0" + tmp.getSeconds().toString() + " ";
        }
        else{
            fullTime += tmp.getSeconds().toString() + " ";
        }
        if(tmp.getDate() < 10){
            fullTime += "0" + tmp.getDate().toString() + "/";
        }
        else{
            fullTime += tmp.getDate().toString() + "/";
        }
        if(tmp.getMonth() < 9){
            fullTime += "0" + (tmp.getMonth() + 1).toString() + "/";
        }
        else{
            fullTime += (tmp.getMonth() + 1).toString() + "/";
        }
        fullTime += tmp.getFullYear().toString();
        notification.fullTime = fullTime;
        fullTime = "";
    }

    res.render("information/notification", {
        notifications: notifications
    });
});

router.get("/address", async function(req, res){
    res.locals.title = "Sổ địa chỉ";
    var userId = params.currentUserId;
    var user = await Address.findAll({where: {userId: userId}});

    var readAddress = [];
    
    for(var index in user){
        readAddress[index] = user[index].address;
    }

    res.render("information/address", {
        totalAddress: params.totalAddress,
        readAddress: readAddress,
    });
});

router.post("/address", async function(req, res){
    var tmpAddress = req.body.address;
    var userId = params.currentUserId;
    var flag = 0;
    var count = 0;
    var address = [];

    for(var adr of tmpAddress){
        adr = adr.trim();
        if(adr != ""){
            address[count] = adr;
            count++;
        }
    }

    var user = await Address.findAll({where: {userId: userId}});
    var len = user.length;

    if(count > len){
        for(var index in address){
            if(!user){
                params.totalAddress++;
                try{
                    await Address.create({
                        userId: userId,
                        address: address[index],
                        count: params.totalAddress
                    });
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
            else{
                if(parseInt(index) < len){
                    if(user[index].count != parseInt(index) + 1){
                        try{
                            await Address.update({
                                count: parseInt(index) + 1
                            }, {where:{
                                userId: userId,
                                count: user[index].count
                            }});
                        }
                        catch(err){
                            console.log(err);
                            res.status(500).send("Internal Server Error");
                        }
                    }
                    for(var existedIndex in user){
                        if(existedIndex == index){
                            break;
                        }
                        if(address[existedIndex] == address[index]){
                            flag = 1;
                            break;
                        }
                        else flag = 0;
                    }
                    if(flag == 1){
                        try{
                            await Address.update({
                                address: "deleted"
                            }, {where:{
                                userId: userId,
                                count: parseInt(index) + 1
                            }});
                            user[index].address = "deleted";
                            address[index] = "deleted";
                            params.totalAddress--;
                        }
                        catch(err){
                            console.log(err);
                            res.status(500).send("Internal Server Error");
                        }
                    }
                    else if(flag == 0){
                        if(address[index] != user[index].address){
                            try{
                                await Address.update({
                                    address: address[index]
                                }, {where:{
                                    userId: userId,
                                    count: parseInt(index) + 1
                                }});
                                user[index].address = address[index];
                            }
                            catch(err){
                                console.log(err);
                                res.status(500).send("Internal Server Error");
                            }
                        }
                    }
                }
                else{
                    for(var existedAddress of user){
                        if(existedAddress.address == address[index]){
                            flag = 1;
                            break;
                        }
                        else flag = 0;
                    }
                    if(flag == 0){
                        params.totalAddress++;
                        try{
                            await Address.create({
                                userId: userId,
                                address: address[index],
                                count: params.totalAddress
                            });
                        }
                        catch(err){
                            console.log(err);
                            res.status(500).send("Internal Server Error");
                        }
                    }
                }
            }
            if(address[index] == "deleted"){
                try{
                    await Address.destroy({where:{
                        userId: userId,
                        address: "deleted"
                    }});
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
        }
    }
    else{
        for(var index in user){
            if(user[index].count != parseInt(index) + 1){
                try{
                    await Address.update({
                        count: parseInt(index) + 1
                    }, {where:{
                        userId: userId,
                        count: user[index].count
                    }});
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
            if(parseInt(index) >= count){
                try{
                    await Address.destroy({where:{
                        userId: userId,
                        count:{
                            [Op.gt]: count
                        }
                    }});
                    params.totalAddress -= len - count;
                    break;
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
            for(var existedIndex in user){
                if(existedIndex == index){
                    break;
                }
                if(address[existedIndex] == address[index]){
                    flag = 1;
                    break;
                }
                else flag = 0;
            }
            if(flag == 1){
                try{
                    await Address.update({
                        address: "deleted"
                    }, {where:{
                        userId: userId,
                        count: parseInt(index) + 1
                    }});
                    user[index].address = "deleted";
                    address[index] = "deleted";
                    params.totalAddress--;
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
            else if(flag == 0){
                if(address[index] != user[index].address){
                    try{
                        await Address.update({
                            address: address[index]
                        }, {where:{
                            userId: userId,
                            count: parseInt(index) + 1
                        }});
                        user[index].address = address[index];
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    }
                }
            }
            if(address[index] == "deleted"){
                try{
                    await Address.destroy({where:{
                        userId: userId,
                        address: "deleted"
                    }});
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
        }
    }

    if(count != len){
        try{
            await UserInfo.update({
                totalAddress: params.totalAddress
            }, {where:{
                userId: userId
            }});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    req.flash("info", "Đã lưu thông tin thành công!");
    setTimeout(function(){
        res.redirect("/information/address");
    }, 1500);    
});

router.get("/follower", async function(req, res){
    res.locals.title = "Sổ theo dõi";

    var follows = await Follow.findAll({
        where: {userId: params.currentUserId},
        include: {
            model: Shop,
            include: {model: User}
        },
        order:[
            ["id", "DESC"]
        ]
    });
    var tmp = "";
    var tmpA = [];
    for(var follow of follows){
        tmp = follow.createdAt;
        tmpA = tmp.split("-");
        follow.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];
    }

    res.render("information/follower", {
        follows: follows
    });
});

router.post("/follower/removeFollow/:shopId", async function(req, res){
    try{
        await Follow.destroy({where:{
            userId: params.currentUserId,
            shopId: req.params.shopId
        }});
    }
    catch(err){
        console.log(err);
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
    res.sendStatus(200);
});

router.post("/follower/addFollow/:shopId", async function(req, res){
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
    res.sendStatus(200);
});

var checked = 0;
router.get("/setting", async function(req, res){
    res.locals.title = "Cài đặt tài khoản";
    var username = res.locals.currentUser.username;
    
    var user = await User.findOne({where: {username: username}});
    if(user){
        var email = user.email;
    }

    res.render("information/setting", {
        checked: checked,
        email: email,
        username: username
    });
});

router.post("/setting", async function(req, res){
    var oldUsername = res.locals.currentUser.username;
    var username = req.body.username;
    var email = req.body.email;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var reNewPassword = req.body.reNewPassword;
    username = username.trim();
    email = email.trim();
    checked = 0;

    if(!username){
        req.flash("error", "Tên tài khoản không được để trống!");
        return res.redirect("/information/setting");
    }

    if(!email){
        req.flash("error", "Email không được để trống!");
        return res.redirect("/information/setting");
    }

    if(!validator.isEmail(email)){
        req.flash("error", "Email không đúng cú pháp!");
        return res.redirect("/information/setting");
    }

    if(username !== oldUsername){
        var user = await User.findOne({where: {username: username}});
        if(user){
            req.flash("error", "Tên tài khoản " + username + " đã tồn tại!");
            return res.redirect("/information/setting");
        }
    }

    var user = await User.findOne({where: {username: oldUsername}});
    if(user){
        if(user.email !== email){
            var user = await User.findOne({where: {email: email}});
            if(user){
                req.flash("error", "Email " + email + " đã được đăng ký!");
                return res.redirect("/information/setting");
            }
        }
        try{
            await User.update({
                username: username,
                email: email
            }, {where: {username: oldUsername}});
            res.locals.currentUser.username = username;
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    if(oldPassword || newPassword || reNewPassword){
        checked = 1;
        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();
        reNewPassword = reNewPassword.trim();
        if(!oldPassword){
            req.flash("error", "Lưu thông tin không thành công!");
            req.flash("errorChangePassword", "Chưa nhập mật khẩu hiện tại!");
            return res.redirect("/information/setting");
        }
        
        if(!newPassword){
            req.flash("error", "Lưu thông tin không thành công!");
            req.flash("errorChangePassword", "Chưa nhập mật khẩu mới!");
            return res.redirect("/information/setting");
        }
        
        if(!reNewPassword){
            req.flash("error", "Lưu thông tin không thành công!");
            req.flash("errorChangePassword", "Chưa nhập xác nhận mật khẩu mới!");
            return res.redirect("/information/setting");
        }

        var user = await User.findOne({where: {username: oldUsername}});
        if(user.password != null){
            var result = await bcrypt.compare(oldPassword, user.password);
            if(!result){
                req.flash("error", "Lưu thông tin không thành công!");
                req.flash("errorChangePassword", "Sai mật khẩu!");
                return res.redirect("/information/setting");
            }
        }

        if(newPassword !== reNewPassword){
            req.flash("error", "Lưu thông tin không thành công!");
            req.flash("errorChangePassword", "Mật khẩu mới không khớp!");
            return res.redirect("/information/setting");
        }

        var salt = bcrypt.genSaltSync(10);

        try{
            await User.update({
                password: bcrypt.hashSync(newPassword, salt)
            }, {where: {username: oldUsername}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    req.flash("info", "Đã lưu thông tin thành công");
    res.redirect("/information/setting");
});

router.get("/user", blockDeliverRole, blockCustomerRole, async function(req, res){
    res.locals.title = "Quản lý người dùng";
    var total = 0;
    var username = [];
    var email = [];
    var roleId = [];
    var status = [];
    var statusName = [];
    var roleName = [];

    var user = await User.findAll({
        include:[{
            model: Role
        }, {
            model: Status
        }]
    });
    total = user.length;
    for(var index in user){
        username[index] = user[index].username;
        email[index] = user[index].email;
        roleId[index] = user[index].roleId;
        status[index] = user[index].statusId;
        statusName[index] = user[index].status.status;
        roleName[index] = user[index].role.roleName;
    }

    res.render("information/user", {
        total: total,
        username: username,
        email: email,
        roleId: roleId,
        status: status,
        statusName: statusName,
        roleName: roleName
    });
});

router.post("/user", blockDeliverRole, blockCustomerRole, async function(req, res){
    var saveUser = req.body.saveUser;
    var username = req.body.usernameList;
    var roleId = req.body.userRole;
    var status = req.body.userStatus;
    
    try{
        await User.update({
            roleId: roleId[saveUser],
            statusId: status[saveUser]
        }, {where:{
            username: username[saveUser]
        }});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    req.flash("info", "Đã lưu thông tin thành công!");
    res.redirect("/information/user");
});

router.get("/shop", blockDeliverRole, blockCustomerRole, async function(req, res){
    res.locals.title = "Quản lý shop";

    var shops = await Shop.findAll({
        include:{
            model: User,
            include:{
                model: UserInfo
            }
        },
        order:[
            ["id", "DESC"]
        ]
    });
    var images = [];
    var tmp;
    for(var index in shops){
        tmp = shops[index].image.split("\\");
        images[index] = tmp[1] + "/" + tmp[2];
    }
    res.render("information/shop", {
        shops: shops,
        images: images
    });
});

router.get("/category", blockDeliverRole, blockCustomerRole, async function(req, res){
    res.locals.title = "Quản lý loại sản phẩm";
    
    var categories = await Category.findAll({
        order:[
            ["createdAt", "DESC"]
        ]
    });
    var attributes = await Attribute.findAll();

    res.render("information/category", {
        categories: categories,
        attributes: attributes
    });
});

router.post("/category/create", blockDeliverRole, blockCustomerRole, async function(req, res){
    var categoryId = req.body.categoryId;
    var category = req.body.category;
    var raw = req.body.attribute;
    var attribute = [];
    categoryId = categoryId.trim();
    category = category.trim();

    if(!categoryId){
        return res.json({
            tokenError: true,
            message: "Chưa nhập mã loại sản phẩm!"
        });
    }
    if(!(/^[a-zA-Z0-9-_]+$/.test(categoryId))){
        return res.json({
            tokenError: true,
            message: "Mã loại sản phẩm chỉ chứa chữ cái thường, chữ cái in hoa, chữ số, dấu '-', và dấu '_'"
        });
    }
    if(!category){
        return res.json({
            tokenError: true,
            message: "Chưa nhập tên loại sản phẩm!"
        });
    }

    var existedCategoryId = await Category.findOne({where: {id: categoryId}});
    if(existedCategoryId){
        return res.json({
            tokenError: true,
            message: "Mã loại sản phẩm này đã tồn tại!"
        });
    }
    
    var existedCategory = await Category.findOne({where: {category: category}});
    if(existedCategory){
        return res.json({
            tokenError: true,
            message: "Loại sản phẩm này đã tồn tại!"
        });
    }

    for(var tmp of raw){
        tmp.attribute = tmp.attribute.trim();
        tmp.defaultAttribute = tmp.defaultAttribute.trim();
        if(tmp.attribute){
            if(!attribute.some(
                value => {
                    return value.attribute == tmp.attribute;
                }
            )){
                if(!tmp.defaultAttribute) tmp.defaultAttribute = "Không có";
                attribute.push({
                    attribute: tmp.attribute,
                    defaultAttribute: tmp.defaultAttribute
                });
            }
            else{
                return res.json({
                    tokenError: true,
                    message: "Có thuộc tính trùng nhau!"
                });
            }
        }
    }

    try{
        await Category.create({
            id: categoryId,
            category: category
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    try{
        for(var index in attribute){
            await Attribute.create({
                categoryId: categoryId,
                attribute: attribute[index].attribute,
                defaultAttribute: attribute[index].defaultAttribute
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    return res.json({
        tokenError: false,
        message: "Đã thêm loại sản phẩm mới!"
    });
});

router.post("/category/update/:categoryId", blockDeliverRole, blockCustomerRole, async function(req, res){
    var categoryId = req.params.categoryId;
    var newCategoryId = req.body.newCategoryId;
    var newCategory = req.body.newCategory;
    var raw = req.body.newAttribute;
    var newAttribute = [];

    console.log(raw);

    if(!newCategoryId){
        return res.json({
            tokenError: true,
            message: "Chưa nhập mã loại sản phẩm!"
        });
    }
    if(!newCategory){
        return res.json({
            tokenError: true,
            message: "Chưa nhập tên loại sản phẩm!"
        });
    }
    var existedCategoryId = await Category.findOne({where:{
        id:{
            [Op.not]: categoryId,
            [Op.eq]: newCategoryId
        }
    }});
    if(existedCategoryId){
        return res.json({
            tokenError: true,
            message: "Mã loại sản phẩm này đã tồn tại!"
        });
    }
    var existedCategory = await Category.findOne({where: {
        category: newCategory,
        id:{
            [Op.not]: categoryId
        }
    }});
    if(existedCategory){
        return res.json({
            tokenError: true,
            message: "Loại sản phẩm này đã tồn tại!"
        });
    }

    for(var tmp of raw){
        tmp.newAttribute = tmp.newAttribute.trim();
        tmp.newDefaultAttribute = tmp.newDefaultAttribute.trim();
        if(tmp.newAttribute){
            if(!newAttribute.some(
                value => {
                    return value.newAttribute == tmp.newAttribute;
                }
            )){
                if(!tmp.newDefaultAttribute) tmp.newDefaultAttribute = "Không có";
                newAttribute.push({
                    newAttribute: tmp.newAttribute,
                    newDefaultAttribute: tmp.newDefaultAttribute
                });
            }
            else{
                return res.json({
                    tokenError: true,
                    message: "Có thuộc tính trùng nhau!"
                });
            }
        }
    }

    try{
        await Category.update({
            id: newCategoryId,
            category: newCategory
        }, {where: {id: categoryId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    var attribute = await Attribute.findAll({where: {categoryId: newCategoryId}});
    var len = attribute.length;
    var newLen = newAttribute.length;
    if(newLen < len){
        for(var i = 0; i < newLen; i++){
            try{
                await Attribute.update({
                    attribute: newAttribute[i].newAttribute,
                    defaultAttribute: newAttribute[i].newDefaultAttribute
                }, {where:{
                    categoryId: newCategoryId,
                    attribute: attribute[i].attribute
                }});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        for(var i = newLen; i < len; i++){
            try{
                await Attribute.destroy({where:{
                    categoryId: newCategoryId,
                    attribute: attribute[i].attribute
                }});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
    }
    else{
        for(var i = 0; i < len; i++){
            try{
                await Attribute.update({
                    attribute: newAttribute[i].newAttribute,
                    defaultAttribute: newAttribute[i].newDefaultAttribute
                }, {where:{
                    categoryId: newCategoryId,
                    attribute: attribute[i].attribute
                }});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        if(newLen > len){
            for(var i = len; i < newLen; i++){
                try{
                    await Attribute.create({
                        categoryId: newCategoryId,
                        attribute: newAttribute[i].newAttribute,
                        defaultAttribute: newAttribute[i].newDefaultAttribute
                    });
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
        }
    }

    return res.json({
        tokenError: false,
        message: "Đã lưu thông tin thành công!"
    });
});

router.post("/category/delete/:categoryId", blockDeliverRole, blockCustomerRole, async function(req, res){
    var categoryId = req.params.categoryId;

    try{
        await Category.destroy({where: {id: categoryId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    res.sendStatus(200);
});

router.get("/deliver", blockAdminRole, blockCustomerRole, async function(req, res){
    var deliver = await Deliver.findOne({where: {userId: params.currentUserId}});
    if(!deliver) res.redirect("/information/deliver-create");
    else{
        res.locals.title = "Quản lý vận chuyển";

        var orders = await Order.findAll({
            include:[{
                model: Deliver,
                where: {userId: params.currentUserId}
            }, {
                model: OrderItem,
                include:{
                    model: Item
                }
            }],
            order:[
                ["orderstatusId", "ASC"],
                ["id", "DESC"]
            ]
        });
        
        var tmp = "";
        var tmpA = [];

        for(var order of orders){
            tmp = order.createdAt;
            tmpA = tmp.split("-");
            order.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

            order.purchasePrice = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            if((order.purchasePrice - order.deliver.freePrice) >= order.deliver.freePrice){
                order.deliver.deliverPrice = 0;
            }
            order.deliver.deliverPrice = order.deliver.deliverPrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });

            for(var orderItem of order.orderitems){
                tmp = orderItem.item.image;
                tmpA = tmp.split("\\");
                orderItem.item.image = tmpA[1] + "/" + tmpA[2];

                orderItem.purchasePrice = orderItem.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            }
        }

        res.render("information/deliver", {
            orders: orders
        });
    }
});

router.post("/deliver/accept/:orderId", blockAdminRole, blockCustomerRole, async function(req, res){
    try{
        await Order.update({
            orderstatusId: 2
        }, {where: {id: req.params.orderId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    var content = "Đơn hàng số " + req.params.orderId + " bao gồm các sản phẩm: ";
    var order = await Order.findOne({
        where: {id: req.params.orderId},
        include:[{
            model: OrderItem,
            include:{
                model: Item
            }
        }, {
            model: User
        }]
    });
    for(var index in order.orderitems){
        if(parseInt(index) != (order.orderitems.length - 1)){
            content += order.orderitems[index].amount + " x " + order.orderitems[index].item.itemName + ", ";
        }
        else{
            content += order.orderitems[index].amount + " x " + order.orderitems[index].item.itemName + " ";
        }
    }
    content += "đã được tiếp nhận và đang xử lý.";

    try{
        await Notification.create({
            userId: order.user.id,
            content: content
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    res.sendStatus(200);
});

router.post("/deliver/complete/:orderId", blockAdminRole, blockCustomerRole, async function(req, res){
    try{
        await Order.update({
            orderstatusId: 3
        }, {where: {id: req.params.orderId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    var content = "Đơn hàng số " + req.params.orderId + " bao gồm các sản phẩm: ";
    var order = await Order.findOne({
        where: {id: req.params.orderId},
        include:[{
            model: OrderItem,
            include:{
                model: Item
            }
        }, {
            model: User
        }]
    });
    for(var index in order.orderitems){
        try{
            await Item.update({
                sold: order.orderitems[index].item.sold + order.orderitems[index].amount
            }, {where: {id: order.orderitems[index].itemId}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        if(parseInt(index) != (order.orderitems.length - 1)){
            content += order.orderitems[index].amount + " x " + order.orderitems[index].item.itemName + ", ";
        }
        else{
            content += order.orderitems[index].amount + " x " + order.orderitems[index].item.itemName + " ";
        }
    }
    content += "đã được giao thành công.";

    try{
        await Notification.create({
            userId: order.user.id,
            content: content
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    res.sendStatus(200);
});

router.post("/deliver/refuse/:orderId", blockAdminRole, blockCustomerRole, async function(req, res){
    try{
        await Order.update({
            orderstatusId: 4
        }, {where: {id: req.params.orderId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    var content = "Đơn hàng số " + req.params.orderId + " bao gồm các sản phẩm: ";
    var order = await Order.findOne({
        where: {id: req.params.orderId},
        include:[{
            model: OrderItem,
            include:{
                model: Item
            }
        }, {
            model: User
        }]
    });
    for(var index in order.orderitems){
        try{
            await Item.update({
                amount: order.orderitems[index].item.amount + order.orderitems[index].amount
            }, {where: {id: order.orderitems[index].itemId}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        if(parseInt(index) != (order.orderitems.length - 1)){
            content += order.orderitems[index].amount + " x " + order.orderitems[index].item.itemName + ", ";
        }
        else{
            content += order.orderitems[index].amount + " x " + order.orderitems[index].item.itemName + " ";
        }
    }
    content += "không được tiếp nhận. Lý do: ";
    var reason = req.body.reason;
    reason = reason.trim();
    if(!reason){
        reason = "Không có";
    }
    content += reason;

    try{
        await Notification.create({
            userId: order.user.id,
            content: content
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    res.sendStatus(200);
});

router.get("/deliver-create", blockAdminRole, blockCustomerRole, async function(req, res){
    var deliver = await Deliver.findOne({where: {userId: params.currentUserId}});
    if(deliver) res.redirect("/information/deliver");
    else{
        res.locals.title = "Tạo đơn vị vận chuyển mới";
        res.render("information/deliver-create");
    }
});

router.post("/deliver-create", blockAdminRole, blockCustomerRole, async function(req, res){
    var deliverName = req.body.deliverName;
    var deliverPrice = req.body.deliverPrice;
    var freePrice = req.body.freePrice;

    deliverName = deliverName.trim();
    deliverPrice = deliverPrice.trim();
    freePrice = freePrice.trim();
    if(!deliverName){
        req.flash("error", "Chưa nhập tên đơn vị vận chuyển!");
        return res.redirect("/information/deliver-create");
    }
    if(!deliverPrice){
        req.flash("error", "Chưa nhập giá vận chuyển!");
        return res.redirect("/information/deliver-create");
    }
    if(!freePrice){
        req.flash("error", "Chưa nhập giá miễn phí vận chuyển!");
        return res.redirect("/information/deliver-create");
    }

    try{
        await Deliver.create({
            userId: params.currentUserId,
            deliverName: deliverName,
            deliverPrice: deliverPrice,
            freePrice: freePrice
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
    res.redirect("/information/deliver");
});

module.exports = router;
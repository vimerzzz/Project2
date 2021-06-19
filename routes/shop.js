var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

var ensureAuthenticated = require("../auth/authPage").ensureAuthenticated;

var db = require("../models/createdatabase");
var params = require("../params/params");

var UserInfo = db.UserInfo;
var Shop = db.Shop;
var Item = db.Item;
var Category = db.Category;
var Attribute = db.Attribute;
var OrderItem = db.OrderItem;
var Order = db.Order;
var Op = db.Op;

var router = express.Router();

var storage = multer.diskStorage({
    destination: "./public/images/",
    filename: function(req, file, cb){
        crypto.pseudoRandomBytes(16, function(err, raw){
            cb(null, raw.toString("hex") + Date.now() + path.extname(file.originalname));
        });
    }
});

var upload = multer({storage: storage});

router.use(ensureAuthenticated);

router.get("/create", async function(req, res){
    if(params.hasShop == 1) res.redirect("/shop/dashboard");
    else{
        res.locals.title = "Tạo shop mới";
        var check = await UserInfo.findOne({where: {userId: params.currentUserId}});
        if(!check.fullName){
            req.flash("error", "Bạn phải điền tên đầy đủ của mình trước khi tạo shop mới!");
            return res.redirect("/information/home");
        }
        res.render("shop/create");
    }
});

router.post("/create", upload.single("image"), async function(req, res){
    var shopName = req.body.shopName;
    var shopInformation = req.body.shopInformation;
    shopName = shopName.trim();
    shopInformation = shopInformation.trim();
    
    var allShop = await Shop.findAll();

    if(!shopName){
        req.flash("error", "Chưa nhập tên shop!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/create");
    }
    else{
        for(var existedShop of allShop){
            if(existedShop.shopName == shopName){
                req.flash("error", "Tên shop này đã tồn tại!");
                if(req.file){
                    fs.unlink(req.file.path, function(err){
                        if(err) console.log(err);
                    });
                }
                return res.redirect("/shop/create");
            }
        }
        params.hasShop = 1;
        try{
            await UserInfo.update({
                hasShop: 1
            }, {where:{
                userId: params.currentUserId
            }});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }

        if(req.file){
            try{
                await Shop.create({
                    userId: params.currentUserId,
                    shopName: shopName,
                    shopInformation: shopInformation,
                    totalFollower: 0,
                    totalItem: 0,
                    image: req.file.path,
                    hasImage: 1
                });
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        else{
            try{
                await Shop.create({
                    userId: params.currentUserId,
                    shopName: shopName,
                    shopInformation: shopInformation,
                    totalFollower: 0,
                    totalItem: 0,
                    image: "public\\images\\no-avatar.png",
                    hasImage: 0
                });
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
    }
    
    res.redirect("/shop/dashboard");
});

router.get("/dashboard", async function(req, res){
    if(params.hasShop == 0) res.redirect("/shop/create");
    else{
        res.locals.title = "Thống kê";
        var shop = await Shop.findOne({where: {userId: params.currentUserId}});

        var orderItems = await OrderItem.findAll({
            include:[{
                model: Item,
                include:{
                    model: Shop,
                    where: {userId: params.currentUserId}
                }
            }, {
                model: Order
            }]
        });
        var income = 0;
        for(var orderItem of orderItems){
            if((orderItem.order.orderstatusId == 3) && (orderItem.createdAt.getFullYear() == 2021)){
                income += orderItem.purchasePrice;
            }
        }
        income = income.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });

        res.render("shop/dashboard", {
            shop: shop,
            income: income
        });
    }
});

router.get("/items", async function(req, res){
    if(params.hasShop == 0) res.redirect("/shop/create");
    else{
        res.locals.title = "Chi tiết các sản phẩm";
        var items = await Item.findAll({
            include:[{
                model: Shop,
                where: {userId: params.currentUserId}
            }, {
                model: Category
            }],
            order:[
                ["count", "DESC"]
            ]
        });
        var categories = await Category.findAll({
            order:[
                ["category", "ASC"]
            ]
        });
        var images = [];
        var tmp;
        for(var index in items){
            tmp = items[index].image.split("\\");
            images[index] = tmp[1] + "/" + tmp[2];
            items[index].price = items[index].price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            items[index].priceDiscount = items[index].priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        }
        res.render("shop/items", {
            items: items,
            images: images,
            categories: categories
        });
    }
});

router.post("/items/update/:itemId", upload.single("image"), async function(req, res){
    var itemId = req.params.itemId;
    var itemName = req.body.itemName;
    var information = req.body.information;
    var price = req.body.price;
    var amount = req.body.amount;
    var oldImage = req.body.oldImage;
    var categoryId = req.body.categoryId;
    var priceDiscount = req.body.priceDiscount;
    var itemNameUrl = "";
    itemName = itemName.trim();
    information = information.trim();
    price = price.trim();
    priceDiscount = priceDiscount.trim();
    amount = amount.trim();

    if(!itemName){
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.json({
            tokenError: true,
            message: "Chưa nhập tên sản phẩm!"
        });
    }
    for(var char of itemName){
        if(!(/^[a-zA-Z0-9áàảãạắằẳẵặấầẩẫậăâÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬéèẻẽẹêếềểễệÉÈẺẼẸÊẾỀỂỄỆúùủũụưứừửữựÚÙỦŨỤỨỪỬỮỰóòỏõọôốồổỗộơớờởỡợÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢíìỉĩịÍÌỈĨỊýỳỷỹỵÝỲỶỸỴđĐ]$/.test(char))){
            char = "-";
        }
        itemNameUrl = itemNameUrl.concat(char);
    }
    if(!information){
        information = "Không có";
    }
    if(!price){
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.json({
            tokenError: true,
            message: "Chưa nhập giá sản phẩm!"
        });
    }
    if(!priceDiscount || (priceDiscount == 0)){
        priceDiscount = price;
    }
    if(!amount){
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.json({
            tokenError: true,
            message: "Chưa nhập số lượng sản phẩm!"
        });
    }
    if(categoryId == "0"){
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.json({
            tokenError: true,
            message: "Sản phẩm chưa được phân loại!"
        });
    }
    if(parseInt(priceDiscount) > parseInt(price)){
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.json({
            tokenError: true,
            message: "Giá sản phẩm không hợp lệ!"
        });
    }

    var existedItem = await Item.findOne({where:{
        itemName: itemName,
        id:{
            [Op.not]: itemId
        }
    }, include:{
        model: Shop,
        where: {userId: params.currentUserId}
    }});
    if(existedItem){
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.json({
            tokenError: true,
            message: "Sản phẩm này đã tồn tại!"
        });
    }
    else{
        itemNameUrl = itemNameUrl.concat("-").concat(itemId);
        if(!req.file){
            try{
                await Item.update({
                    itemName: itemName,
                    information: information,
                    price: price,
                    amount: amount,
                    categoryId: categoryId,
                    priceDiscount: priceDiscount,
                    itemNameUrl: itemNameUrl
                }, {where: {id: itemId}});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        else{
            try{
                fs.unlink(oldImage, function(err){
                    if(err) console.log(err);
                });
                await Item.update({
                    itemName: itemName,
                    information: information,
                    price: price,
                    amount: amount,
                    image: req.file.path,
                    categoryId: categoryId,
                    priceDiscount: priceDiscount,
                    itemNameUrl: itemNameUrl
                }, {where: {id: itemId}});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
    }

    return res.json({
        tokenError: false,
        message: "Đã lưu thông tin thành công!"
    });
});

router.post("/items/delete/:itemId", async function(req, res){
    var itemId = req.params.itemId;
    
    var item = await Item.findOne({where: {id: itemId}});
    fs.unlink(item.image, function(err){
        if(err) console.log(err);
    });
    
    try{
        await Item.destroy({where: {id: itemId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    res.sendStatus(200);
});

router.get("/item-create", async function(req, res){
    if(params.hasShop == 0) res.redirect("/shop/create");
    else{
        res.locals.title = "Thêm sản phẩm";
        
        var categories = await Category.findAll({
            order:[
                ["category", "ASC"]
            ]
        });

        res.render("shop/item-create", {
            categories: categories
        });
    }
});

router.post("/item-create/getCategory/:categoryId", async function(req, res){
    var attributes = await Attribute.findAll({where: {categoryId: req.params.categoryId}});
    return res.json(attributes);
});

router.post("/item-create", upload.single("image"), async function(req, res){
    var itemName = req.body.itemName;
    var information = req.body.information;
    var price = req.body.price;
    var priceDiscount = req.body.priceDiscount;
    var amount = req.body.amount;
    var categoryId = req.body.categoryId;
    var itemNameUrl = "";
    itemName = itemName.trim();
    information = information.trim();
    price = price.trim();
    priceDiscount = priceDiscount.trim();
    amount = amount.trim();

    if(!itemName){
        req.flash("error", "Chưa nhập tên sản phẩm!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/item-create");
    }
    for(var char of itemName){
        if(!(/^[a-zA-Z0-9áàảãạắằẳẵặấầẩẫậăâÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬéèẻẽẹêếềểễệÉÈẺẼẸÊẾỀỂỄỆúùủũụưứừửữựÚÙỦŨỤỨỪỬỮỰóòỏõọôốồổỗộơớờởỡợÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢíìỉĩịÍÌỈĨỊýỳỷỹỵÝỲỶỸỴđĐ]$/.test(char))){
            char = "-";
        }
        itemNameUrl = itemNameUrl.concat(char);
    }
    if(!information){
        information = "Không có";
    }
    if(!price){
        req.flash("error", "Chưa nhập giá sản phẩm!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/item-create");
    }
    if(!priceDiscount || (priceDiscount == 0)){
        priceDiscount = price;
    }
    if(!amount){
        req.flash("error", "Chưa nhập số lượng sản phẩm!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/item-create");
    }
    if(categoryId == "0"){
        req.flash("error", "Sản phẩm chưa được phân loại!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/item-create");
    }
    if(!req.file){
        req.flash("error", "Sản phẩm chưa có hình ảnh!");
        return res.redirect("/shop/item-create");
    }
    if(parseInt(priceDiscount) > parseInt(price)){
        req.flash("error", "Giá sản phẩm không hợp lệ!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/item-create");
    }

    var shop = await Shop.findOne({where: {userId: params.currentUserId}});
    var item = await Item.findOne({where:{
        itemName: itemName,
        shopId: shop.id
    }});
    if(!item){
        params.totalItem++;
        var id = "i.".concat(params.currentUserId.toString()).concat(".").concat(params.totalItem.toString());
        itemNameUrl = itemNameUrl.concat("-").concat(id);
        try{
            await Shop.update({
                totalItem: params.totalItem
            }, {where: {userId: params.currentUserId}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        try{
            await Item.create({
                shopId: shop.id,
                id: id,
                itemName: itemName,
                information: information,
                price: price,
                amount: amount,
                image: req.file.path,
                categoryId: categoryId,
                priceDiscount: priceDiscount,
                itemNameUrl: itemNameUrl,
                sold: 0,
                count: params.totalItem
            });
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
    else{
        req.flash("error", "Sản phẩm này đã tồn tại!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/item-create");
    }

    req.flash("info", "Đã thêm sản phẩm thành công!");
    res.redirect("/shop/item-create");
});

router.get("/setting", async function(req, res){
    if(params.hasShop == 0) res.redirect("/shop/create");
    else{
        res.locals.title = "Cài đặt shop";
        var shop = await Shop.findOne({where: {userId: params.currentUserId}});

        var image = shop.image;
        var tmp = image.split("\\");
        image = tmp[1] + "/" + tmp[2];

        res.render("shop/setting", {
            shopName: shop.shopName,
            shopInformation: shop.shopInformation,
            image: image
        });
    }
});

router.post("/setting", upload.single("image"), async function(req, res){
    var shopName = req.body.shopName;
    var shopInformation = req.body.shopInformation;
    var oldImage = req.body.oldImage;
    shopName = shopName.trim();
    shopInformation = shopInformation.trim();

    var allShop = await Shop.findAll({where:{
        userId:{
            [Op.not]: params.currentUserId
        }
    }});

    if(!shopName){
        req.flash("error", "Chưa nhập tên shop!");
        if(req.file){
            fs.unlink(req.file.path, function(err){
                if(err) console.log(err);
            });
        }
        return res.redirect("/shop/setting");
    }
    else{
        for(var existedShop of allShop){
            if(existedShop.shopName == shopName){
                req.flash("error", "Tên shop này đã tồn tại!");
                if(req.file){
                    fs.unlink(req.file.path, function(err){
                        if(err) console.log(err);
                    });
                }
                return res.redirect("/shop/setting");
            }
        }
        if(!req.file){
            try{
                await Shop.update({
                    shopName: shopName,
                    shopInformation: shopInformation
                }, {where:{
                    userId: params.currentUserId
                }});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        else{
            try{
                await Shop.update({
                    shopName: shopName,
                    shopInformation: shopInformation,
                    image: req.file.path,
                    hasImage: 1
                }, {where:{
                    userId: params.currentUserId
                }});
                if(oldImage != "public/images/no-avatar.png"){
                    fs.unlink(oldImage, function(err){
                        if(err) console.log(err);
                    });
                }
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
    }

    req.flash("info", "Đã lưu thông tin thành công!");
    res.redirect("/shop/setting");
});

module.exports = router;
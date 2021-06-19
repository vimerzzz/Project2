var express = require("express");
var validator = require("validator");

var ensureAuthenticated = require("../auth/authPage").ensureAuthenticated;

var db = require("../models/createdatabase");
var params = require("../params/params");

var Cart = db.Cart;
var Item = db.Item;
var Address = db.Address;
var User = db.User;
var UserInfo = db.UserInfo;
var Order = db.Order;
var OrderItem = db.OrderItem;
var Deliver = db.Deliver;
var Notification = db.Notification;

var router = express.Router();

router.use(ensureAuthenticated);

router.get("/cart", async function(req, res){
    res.locals.title = "Giỏ hàng";

    var carts = await Cart.findAll({
        where: {userId: params.currentUserId},
        include: {model: Item}
    });

    var tmp = "";
    var tmpA = [];
    var maxPrice = 0;
    var totalPriceNumber = 0;
    var totalPrice = "";
    for(var cart of carts){
        tmp = cart.item.image;
        tmpA = tmp.split("\\");
        cart.item.image = tmpA[1] + "/" + tmpA[2];

        maxPrice = cart.item.priceDiscount * cart.amount;
        totalPriceNumber += maxPrice;

        cart.item.price = cart.item.price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        cart.item.priceDiscount = cart.item.priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        cart.maxPrice = maxPrice.toLocaleString("vn-VN", { style: 'currency', currency: 'VND' });
    }

    totalPrice = totalPriceNumber.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });

    res.render("purchase/cart", {
        carts: carts,
        totalPrice: totalPrice
    });
});

router.post("/cart/delete/:cartId", async function(req, res){
    try{
        await Cart.destroy({where: {id: req.params.cartId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    res.sendStatus(200);
});

router.post("/cart/update/:cartId", async function(req, res){
    try{
        await Cart.update({
            amount: req.body.amount
        }, {where: {id: req.params.cartId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    res.sendStatus(200);
});

router.get("/order", async function(req, res){
    res.locals.title = "Thanh toán";

    var user = await User.findOne({
        where: {id: params.currentUserId},
        include:[{
            model: Cart,
            include: {
                model: Item
            }
        }, {
            model: Address
        }, {
            model: UserInfo
        }]
    });

    var delivers = await Deliver.findAll();

    var tmp = "";
    var tmpA = [];
    var maxPrice = 0;
    var totalPriceNumber = 0;
    var totalPrice = [];

    for(var cart of user.carts){
        tmp = cart.item.image;
        tmpA = tmp.split("\\");
        cart.item.image = tmpA[1] + "/" + tmpA[2];

        maxPrice = cart.item.priceDiscount * cart.amount;
        totalPriceNumber += maxPrice;

        cart.item.price = cart.item.price.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        cart.item.priceDiscount = cart.item.priceDiscount.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        cart.maxPrice = maxPrice.toLocaleString("vn-VN", { style: 'currency', currency: 'VND' });
    }
    for(var deliver of delivers){
        deliver.deliverPriceTextTmp = deliver.deliverPrice.toLocaleString("vn-VN", { style: 'currency', currency: 'VND' });
        if(totalPriceNumber >= deliver.freePrice) deliver.deliverPrice = 0;
        deliver.deliverPriceText = deliver.deliverPrice.toLocaleString("vn-VN", { style: 'currency', currency: 'VND' });
        deliver.freePrice = deliver.freePrice.toLocaleString("vn-VN", { style: 'currency', currency: 'VND' });
        totalPriceNumber += deliver.deliverPrice;
        totalPrice.push(totalPriceNumber.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' }));
        totalPriceNumber -= deliver.deliverPrice;
    }
    if(delivers[0]){
        totalPriceNumber += delivers[0].deliverPrice;
    }

    res.render("purchase/order", {
        user: user,
        totalPrice: totalPrice,
        totalPriceNumber: totalPriceNumber,
        delivers: delivers
    });
});

router.post("/order", async function(req, res){
    var fullName = req.body.fullName;
    var checkBox = req.body.checkBox;
    var addressId = req.body.address;
    var newAddress = req.body.newAddress;
    var purchasePrice = req.body.purchasePrice;
    var deliverId = req.body.deliverId;
    var phone = req.body.phone;
    var note = req.body.note;

    fullName = fullName.trim();
    phone = phone.trim();
    note = note.trim();
    console.log(note);
    if(newAddress){
        newAddress = newAddress.trim();
    }

    if(!fullName){
        req.flash("error", "Chưa có tên người thanh toán!");
        return res.redirect("/purchase/order");
    }
    if(!addressId || (addressId == "0" && !newAddress)){
        req.flash("error", "Chưa có địa chỉ thanh toán!");
        return res.redirect("/purchase/order");
    }
    if(!note){
        note = "Không có";
    }
    if(!phone){
        req.flash("error", "Chưa có số điện thoại liên hệ!");
        return res.redirect("/purchase/order");
    }
    else{
        if(!validator.isMobilePhone(phone, "vi-VN")){
            req.flash("error", "Số điện thoại không đúng cú pháp!");
            return res.redirect("/purchase/order");
        }
    }

    params.totalOrder++;
    var carts = await Cart.findAll({
        where: {userId: params.currentUserId},
        include: {model: Item}
    });
    for(var cart of carts){
        if(cart.amount > cart.item.amount){
            req.flash("error", "Số lượng sản phẩm không đủ hoặc sản phẩm đã hết hàng!");
            return res.redirect("/purchase/order");
        }
    }
    var newOrder;

    if(addressId != "0"){
        if(!checkBox){
            try{
                await UserInfo.update({
                    fullName: fullName,
                    totalOrder: params.totalOrder,
                    phone: phone
                }, {where: {userId: params.currentUserId}});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
        else{
            try{
                await UserInfo.update({
                    totalOrder: params.totalOrder
                }, {where: {userId: params.currentUserId}});
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }

        var address = await Address.findOne({where: {id: addressId}});

        try{
            newOrder = await Order.create({
                fullName: fullName,
                userId: params.currentUserId,
                purchasePrice: purchasePrice,
                address: address.address,
                orderstatusId: 1,
                deliverId: deliverId,
                note: note,
                phone: phone
            });
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
    else{
        var existedAddress = await Address.findOne({where:{
            userId: params.currentUserId,
            address: newAddress
        }});
        if(existedAddress){
            req.flash("error", "Địa chỉ này đã tồn tại!");
            return res.redirect("/purchase/order");
        }
        else{
            params.totalAddress++;
            if(!checkBox){
                try{
                    await UserInfo.update({
                        fullName: fullName,
                        totalOrder: params.totalOrder,
                        totalAddress: params.totalAddress,
                        phone: phone
                    }, {where: {userId: params.currentUserId}});
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }
            else{
                try{
                    await UserInfo.update({
                        totalOrder: params.totalOrder,
                        totalAddress: params.totalAddress
                    }, {where: {userId: params.currentUserId}});
                }
                catch(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            }

            try{
                await Address.create({
                    count: params.totalAddress,
                    userId: params.currentUserId,
                    address: newAddress
                });
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }

            try{
                newOrder = await Order.create({
                    fullName: fullName,
                    userId: params.currentUserId,
                    purchasePrice: purchasePrice,
                    address: newAddress,
                    orderstatusId: 1,
                    deliverId: deliverId,
                    phone: phone,
                    note: note
                });
            }
            catch(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
            }
        }
    }
    var count = 0;
    for(var cart of carts){
        count++;
        try{
            await OrderItem.create({
                itemId: cart.itemId,
                amount: cart.amount,
                purchasePrice: cart.amount * cart.item.priceDiscount,
                orderId: newOrder.id
            });
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
    
    var count2 = 0;
    var content = "Đơn hàng số " + newOrder.id.toString() + " bao gồm các sản phẩm: ";
    for(var cart of carts){
        count2++;
        try{
            await Item.update({
                amount: cart.item.amount - cart.amount
            }, {where: {id: cart.itemId}});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        if(count2 != count){
            content += cart.amount.toString() + " x " + cart.item.itemName + ", ";
        }
        else{
            content += cart.amount.toString() + " x " + cart.item.itemName + " ";
        }
    }
    content += "đã được đặt thành công và đang chờ xác nhận.";

    try{
        await Notification.create({
            userId: params.currentUserId,
            content: content
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    try{
        await Cart.destroy({where: {userId: params.currentUserId}});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }

    var url = "/order/".concat(newOrder.id.toString());
    res.redirect(url);
});

module.exports = router;
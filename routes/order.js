var express = require("express");

var ensureAuthenticated = require("../auth/authPage").ensureAuthenticated;

var db = require("../models/createdatabase");
var params = require("../params/params");

var Order = db.Order;
var OrderStatus = db.OrderStatus;
var OrderItem = db.OrderItem;
var Address = db.Address;
var Deliver = db.Deliver;
var Item = db.Item;
var Notification = db.Notification;

var router = express.Router();

router.use(ensureAuthenticated);

router.get("/all", ensureAuthenticated, async function(req, res){
    res.locals.title = "Tất cả đơn hàng";

    var orders = await Order.findAll({
        where: {userId: params.currentUserId},
        include:{
            model: OrderStatus
        },
        order:[
            ["id", "DESC"]
        ]
    });

    var tmp = "";
    var tmpA = [];
    for(var order of orders){
        tmp = order.createdAt;
        tmpA = tmp.split("-");
        order.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

        order.purchasePriceText = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
    }

    res.render("order/all", {
        orders: orders
    });
});

router.get("/canceled", async function(req, res){
    res.locals.title = "Đơn hàng bị hủy";

    var orders = await Order.findAll({
        where:{
            userId: params.currentUserId,
            orderstatusId: 4
        },
        order:[
            ["id", "DESC"]
        ]
    });

    var tmp = "";
    var tmpA = [];
    for(var order of orders){
        tmp = order.createdAt;
        tmpA = tmp.split("-");
        order.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

        order.purchasePriceText = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
    }

    res.render("order/canceled", {
        orders: orders
    });
});

router.get("/confirming", async function(req, res){
    res.locals.title = "Đơn hàng chờ xác nhận";

    var orders = await Order.findAll({
        where:{
            userId: params.currentUserId,
            orderstatusId: 1
        },
        order:[
            ["id", "DESC"]
        ]
    });

    var tmp = "";
    var tmpA = [];
    for(var order of orders){
        tmp = order.createdAt;
        tmpA = tmp.split("-");
        order.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

        order.purchasePriceText = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
    }

    res.render("order/confirming", {
        orders: orders
    });
});

router.get("/processing", async function(req, res){
    res.locals.title = "Đơn hàng đang xử lý";

    var orders = await Order.findAll({
        where:{
            userId: params.currentUserId,
            orderstatusId: 2
        },
        order:[
            ["id", "DESC"]
        ]
    });

    var tmp = "";
    var tmpA = [];
    for(var order of orders){
        tmp = order.createdAt;
        tmpA = tmp.split("-");
        order.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

        order.purchasePriceText = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
    }

    res.render("order/processing", {
        orders: orders
    });
});

router.get("/completed", async function(req, res){
    res.locals.title = "Đơn hàng hoàn tất";

    var orders = await Order.findAll({
        where:{
            userId: params.currentUserId,
            orderstatusId: 3
        },
        order:[
            ["id", "DESC"]
        ]
    });

    var tmp = "";
    var tmpA = [];
    for(var order of orders){
        tmp = order.createdAt;
        tmpA = tmp.split("-");
        order.fullDate = tmpA[2] + "/" + tmpA[1] + "/" + tmpA[0];

        order.purchasePriceText = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
    }

    res.render("order/completed", {
        orders: orders
    });
});

router.get("/:orderId", async function(req, res){
    var order = await Order.findOne({
        where:{
            id: req.params.orderId,
            userId: params.currentUserId
        },
        include: [{
            model: OrderItem,
            include:{
                model: Item
            }
        }, {
            model: Deliver
        }]
    });

    if(order){
        res.locals.title = "Chi tiết đơn hàng";
        var tmp = "";
        var tmpA = [];

        order.deliver.deliverPriceTmp = order.deliver.deliverPrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        if((order.purchasePrice - order.deliver.freePrice) >= order.deliver.freePrice){
            order.deliver.deliverPrice = 0;
        }
        order.deliver.deliverPrice = order.deliver.deliverPrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        order.deliver.freePrice = order.deliver.freePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        order.purchasePrice = order.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
        for(var orderItem of order.orderitems){
            orderItem.purchasePrice = orderItem.purchasePrice.toLocaleString('vn-VN', { style: 'currency', currency: 'VND' });
            tmp = orderItem.item.image;
            tmpA = tmp.split("\\");
            orderItem.item.image = tmpA[1] + "/" + tmpA[2];
        }

        res.render("order/detail", {
            order: order
        });
    }
    else{
        res.render("home/404");
    }
});

router.post("/delete/:orderId", async function(req, res){
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
        include:{
            model: OrderItem,
            include:{
                model: Item
            }
        }
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
    content += "đã bị hủy thành công.";
    
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

    res.redirect("/order/all");
});

module.exports = router;
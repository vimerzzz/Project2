var bcrypt = require("bcryptjs");

var db = require("./createdatabase");
var params = require("../params/params");

module.exports = async function(){
    var Role = db.Role;
    var User = db.User;
    var UserInfo = db.UserInfo;
    var Status = db.Status;
    var Shop = db.Shop;
    var OrderStatus = db.OrderStatus;
    var role;
    var user;
    var status;
    var total;
    var orderStatus;
    role = await Role.findOne({where: {roleName: "Admin"}});
    if(!role){
        await Role.create({
            id: 1,
            roleName: "Admin"
        });
    }

    role = await Role.findOne({where: {roleName: "Customer"}});
    if(!role){
        await Role.create({
            id: 2,
            roleName: "Customer"
        });
    }

    role = await Role.findOne({where: {roleName: "Deliver"}});
    if(!role){
        await Role.create({
            id: 3,
            roleName: "Deliver"
        });
    }

    status = await Status.findOne({where: {status: "Active"}});
    if(!status){
        await Status.create({
            id: 1,
            status: "Active"
        });
    }

    status = await Status.findOne({where: {status: "Ban"}});
    if(!status){
        await Status.create({
            id: 2,
            status: "Ban"
        });
    }

    orderStatus = await OrderStatus.findOne({where: {status: "Chờ xác nhận"}});
    if(!orderStatus){
        await OrderStatus.create({
            id: 1,
            status: "Chờ xác nhận"
        });
    }

    orderStatus = await OrderStatus.findOne({where: {status: "Đang xử lý"}});
    if(!orderStatus){
        await OrderStatus.create({
            id: 2,
            status: "Đang xử lý"
        });
    }

    orderStatus = await OrderStatus.findOne({where: {status: "Hoàn tất"}});
    if(!orderStatus){
        await OrderStatus.create({
            id: 3,
            status: "Hoàn tất"
        });
    }

    orderStatus = await OrderStatus.findOne({where: {status: "Bị hủy"}});
    if(!orderStatus){
        await OrderStatus.create({
            id: 4,
            status: "Bị hủy"
        });
    }

    user = await User.findOne({where: {username: "admin"}});
    if(!user){
        var salt = bcrypt.genSaltSync(10);
        try{
            await User.create({
                roleId: 1,
                statusId: 1,
                username: "admin",
                email: "admin@gmail.com",
                password: bcrypt.hashSync("admin", salt)
            });
        }
        catch(err){
            console.log(err);
        }
    }

    user = await User.findOne({where: {username: "deliver1"}});
    if(!user){
        var salt = bcrypt.genSaltSync(10);
        try{
            await User.create({
                roleId: 3,
                statusId: 1,
                username: "deliver1",
                email: "deliver1@gmail.com",
                password: bcrypt.hashSync("deliver1", salt)
            });
        }
        catch(err){
            console.log(err);
        }
    }

    user = await User.findOne({where: {username: "deliver2"}});
    if(!user){
        var salt = bcrypt.genSaltSync(10);
        try{
            await User.create({
                roleId: 3,
                statusId: 1,
                username: "deliver2",
                email: "deliver2@gmail.com",
                password: bcrypt.hashSync("deliver2", salt)
            });
        }
        catch(err){
            console.log(err);
        }
    }

    var userId = params.currentUserId;
    try{
        await User.count({where: {roleId: 1}}).then(function(c){
            params.totalAdmin = c;
        });
        await User.count({where: {roleId: 2}}).then(function(c){
            params.totalCustomer = c;
        });
        await User.count({where: {roleId: 3}}).then(function(c){
            params.totalDeliver = c;
        });
        if(userId){
            total = await UserInfo.findOne({where: {userId: userId}});
            params.totalAddress = total.totalAddress;
            params.hasShop = total.hasShop;
            params.totalOrder = total.totalOrder;

            total = await Shop.findOne({where: {userId: userId}});
            if(total) params.totalItem = total.totalItem;
        }
    }
    catch(err){
        throw err;
    }
};
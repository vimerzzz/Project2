var db = require("./createdatabase");

var Address = db.Address;
var User = db.User;
var UserInfo = db.UserInfo;
var Deliver = db.Deliver;
var Item = db.Item;
var Order = db.Order;
var OrderStatus = db.OrderStatus;
var OrderItem = db.OrderItem;
var Role = db.Role;
var Shop = db.Shop;
var Status = db.Status;
var Category = db.Category;
var Attribute = db.Attribute;
var Follow = db.Follow;
var Cart = db.Cart;
var Notification = db.Notification;

module.exports = function(){
    User.hasMany(Address, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    User.hasOne(Deliver);
    User.hasMany(Order, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Order.belongsTo(User);
    Role.hasMany(User);
    User.belongsTo(Role);
    Status.hasMany(User);
    User.belongsTo(Status);
    User.hasOne(UserInfo, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    UserInfo.belongsTo(User);
    User.hasOne(Shop, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Shop.belongsTo(User);
    Shop.hasMany(Item, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Item.belongsTo(Shop);
    Category.hasMany(Item);
    Item.belongsTo(Category);
    Deliver.hasMany(Order, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Order.belongsTo(Deliver);
    Category.hasMany(Attribute, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    User.hasMany(Follow, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Shop.hasMany(Follow, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Follow.belongsTo(Shop);
    Item.hasMany(Cart, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Cart.belongsTo(Item);
    User.hasMany(Cart, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    OrderStatus.hasMany(Order);
    Order.belongsTo(OrderStatus);
    Order.hasMany(OrderItem, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    OrderItem.belongsTo(Order);
    Item.hasMany(OrderItem, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    OrderItem.belongsTo(Item);
    User.hasMany(Notification, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    Notification.belongsTo(User);
}
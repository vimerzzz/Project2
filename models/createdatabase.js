var Sequelize = require("sequelize");

var params = require("../params/params");

var sequelize = new Sequelize(params.database, params.user, params.password, {dialect: "mysql", host: params.host});

var db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;

db.Address = require("./address").init(sequelize, Sequelize);
db.Deliver = require("./deliver").init(sequelize, Sequelize);
db.Category = require("./category").init(sequelize, Sequelize);
db.Attribute = require("./attribute").init(sequelize, Sequelize);
db.Item = require("./item").init(sequelize, Sequelize);
db.Order = require("./order").init(sequelize, Sequelize);
db.Role = require("./role").init(sequelize, Sequelize);
db.Status = require("./status").init(sequelize, Sequelize);
db.User = require("./user").init(sequelize, Sequelize);
db.UserInfo = require("./userinfo").init(sequelize, Sequelize);
db.Shop = require("./shop").init(sequelize, Sequelize);
db.Follow = require("./follow").init(sequelize, Sequelize);
db.Cart = require("./cart").init(sequelize, Sequelize);
db.OrderItem = require("./orderItem").init(sequelize, Sequelize);
db.OrderStatus = require("./orderStatus").init(sequelize, Sequelize);
db.Notification = require("./notification").init(sequelize, Sequelize);
db.UserCheckPassword = require("./user");

module.exports = db;
module.exports = {init: function(sequelize, Sequelize){
    var OrderStatus = sequelize.define("orderstatus", {
        status:{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return OrderStatus;
}};
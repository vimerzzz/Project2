module.exports = {init: function(sequelize, Sequelize){
    var Order = sequelize.define("order", {
        createdAt:{
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        purchasePrice:{
            type: Sequelize.BIGINT,
            allowNull: false
        },
        fullName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        address:{
            type: Sequelize.STRING,
            allowNull: false
        },
        phone:{
            type: Sequelize.STRING,
            allowNull: false
        },
        note:{
            type: Sequelize.TEXT,
            allowNull: true
        }
    });
    return Order;
}};
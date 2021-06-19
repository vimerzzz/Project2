module.exports = {init: function(sequelize, Sequelize){
    var Item = sequelize.define("item", {
        id:{
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        itemName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt:{
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        price:{
            type: Sequelize.BIGINT,
            allowNull: false
        },
        amount:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        information:{
            type: Sequelize.TEXT,
            allowNull: true
        },
        image:{
            type: Sequelize.STRING,
            allowNull: false
        },
        priceDiscount:{
            type: Sequelize.BIGINT,
            allowNull: false
        },
        itemNameUrl:{
            type: Sequelize.STRING,
            allowNull: false
        },
        sold:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        count:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Item;
}};
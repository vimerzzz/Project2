module.exports = {init: function(sequelize, Sequelize){
    var Shop = sequelize.define("shop", {
        shopName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        shopInformation:{
            type: Sequelize.TEXT,
            allowNull: true
        },
        totalFollower:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        totalItem:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        image:{
            type: Sequelize.STRING,
            allowNull: false
        },
        hasImage:{
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        createdAt:{
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    });
    return Shop;
}};
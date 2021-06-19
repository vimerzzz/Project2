module.exports = {init: function(sequelize, Sequelize){
    var UserInfo = sequelize.define("userinfo", {
        fullName:{
            type: Sequelize.STRING,
            allowNull: true
        },
        sexual:{
            type: Sequelize.STRING,
            allowNull: true
        },
        birthday:{
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        phone:{
            type: Sequelize.STRING,
            allowNull: true
        },
        job:{
            type: Sequelize.STRING,
            allowNull: true
        },
        workplace:{
            type: Sequelize.STRING,
            allowNull: true
        },
        otherInformation:{
            type: Sequelize.TEXT,
            allowNull: true
        },
        hasShop:{
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        totalAddress:{
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        totalFollow:{
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        totalOrder:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return UserInfo;
}};
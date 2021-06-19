module.exports = {init: function(sequelize, Sequelize){
    var Deliver = sequelize.define("deliver", {
        deliverName:{
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt:{
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        deliverPrice:{
            type: Sequelize.BIGINT,
            allowNull: false
        },
        freePrice:{
            type: Sequelize.BIGINT,
            allowNull: false
        }
    });
    return Deliver;
}};
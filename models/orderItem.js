module.exports = {init: function(sequelize, Sequelize){
    var OrderItem = sequelize.define("orderitem", {
        amount:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        purchasePrice:{
            type: Sequelize.BIGINT,
            allowNull: false
        }
    });
    return OrderItem;
}};
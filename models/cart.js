module.exports = {init: function(sequelize, Sequelize){
    var Cart = sequelize.define("cart", {
        amount:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Cart;
}};
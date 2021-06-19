module.exports = {init: function(sequelize, Sequelize){
    var Attribute = sequelize.define("attribute", {
        attribute:{
            type: Sequelize.STRING,
            allowNull: false
        },
        defaultAttribute:{
            type: Sequelize.STRING,
            allowNull: true
        }
    });
    return Attribute;
}};
module.exports = {init: function(sequelize, Sequelize){
    var Category = sequelize.define("category", {
        id:{
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        category:{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Category;
}};
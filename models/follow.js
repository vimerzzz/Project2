module.exports = {init: function(sequelize, Sequelize){
    var Follow = sequelize.define("follow", {
        createdAt:{
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        }
    });
    return Follow;
}};
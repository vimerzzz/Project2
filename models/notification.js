module.exports = {init: function(sequelize, Sequelize){
    var Notification = sequelize.define("notification", {
        content:{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Notification;
}};
module.exports = {init: function(sequelize, Sequelize){
    var Role = sequelize.define("role", {
        roleName:{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Role;
}};
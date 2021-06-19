module.exports = {init: function(sequelize, Sequelize){
    var Status = sequelize.define("status", {
        status:{
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Status;
}};
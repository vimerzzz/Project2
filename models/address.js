module.exports = {init: function(sequelize, Sequelize){
    var Address = sequelize.define("address", {
        address:{
            type: Sequelize.TEXT,
            allowNull: false
        },
        count:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Address;
}};
var bcrypt = require("bcryptjs");

module.exports = {init: function(sequelize, Sequelize){
    var User = sequelize.define("user", {
        username:{
            type: Sequelize.STRING,
            allowNull: false
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false
        },
        email:{
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt:{
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        }
    });
    return User;
}, checkPassword: async function(User, username, password, done){
    var user = await User.findOne({where: {username: username}});
    if(user.password != null){
        bcrypt.compare(password, user.password, function(err, isMatch){
            done(err, isMatch);
        });
    }
}};
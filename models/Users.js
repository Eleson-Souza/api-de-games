const sequelize = require('sequelize');
const connection = require('../database/connection');

const Users = connection.define('users', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
});

//Users.sync({force: false});

module.exports = Users;
const sequelize = require('sequelize');

const connection = new sequelize('db_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;
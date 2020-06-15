const sequelize = require('sequelize');
const connection = require('../database/connection');

const Games = connection.define('games', {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    year: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: sequelize.DECIMAL,
        allowNull: false
    }
});

//Games.sync({force: false});

module.exports = Games;
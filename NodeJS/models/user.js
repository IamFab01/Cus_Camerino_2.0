const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER(4),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.CHAR(80),
        allowNull: false,
    },
    cognome: {
        type: DataTypes.CHAR(80),
        allowNull: false,
    },
    email: {
        type: DataTypes.CHAR(100),
        allowNull: false,
    },
    salt: {
        type: DataTypes.CHAR(200),
        allowNull: false,
    },
    password: {
        type: DataTypes.CHAR(150),
        allowNull: false
    }

}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;
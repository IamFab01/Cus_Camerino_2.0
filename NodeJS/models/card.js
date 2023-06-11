const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

class Card extends Model { }

Card.init({
    id: {
        type: DataTypes.INTEGER(3),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idUtente: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
    },
    codice: {
        type: DataTypes.CHAR(10),
        allowNull: false,
    },
    punti: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'Card'
});

Card.belongsTo(User, {foreignKey: 'idUtente', as: 'owner'});

module.exports = Card; 
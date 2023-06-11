const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model { }

Product.init({
    id: {
        type: DataTypes.INTEGER(3),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    marchio: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    prezzo: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    immagine: {
        type: DataTypes.BLOB,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Product'
});

module.exports = Product; 

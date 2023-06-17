const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Booking extends Model { }

Booking.init({

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
    dataPrenotazione: {
        type: DataTypes.DATE,
        allowNull: false
    },
    oraInizio : {
        type : DataTypes.TIME,
        allowNull: false
    },
    oraFine : {
        type : DataTypes.TIME,
        allowNull: false
    },
    completata: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Booking'
});


module.exports = Booking;



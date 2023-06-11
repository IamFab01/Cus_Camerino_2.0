//Richiede la configurazione del db
const dbConfiguration = require('./database.config.js'); 

//crea una connessione tra sequelize e il db
const Sequelize = require('sequelize'); 
const sequelize = new Sequelize(dbConfiguration.database, dbConfiguration.user, dbConfiguration.password, {
    host: dbConfiguration.host, 
    dialect: dbConfiguration.dialect, 
    pool: {
        max: dbConfiguration.pool.max, 
        min: dbConfiguration.pool.min
    }
}); 

module.exports = sequelize;
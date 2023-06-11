module.exports = {
    host: "localhost", 
    port: 3306, 
    user: "root", 
    password: "MariaDBPW", 
    database: "mydb", 
    dialect: "mysql", 
    pool: {
        max: 5, 
        min: 0
    }
}; 
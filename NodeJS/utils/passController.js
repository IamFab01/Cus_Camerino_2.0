//Importazione di bcrypt
const bcrypt = require('bcrypt');

//Viene definita una costante segreta che viene concatenata alla password per aumentare la complessità dell'hash
const secret = "!Rj(98bC%9sVn&^c";


/*Prende una password e un salt come parametri. Concatena la password con la costante segreta e quindi 
utilizza la funzione bcrypt.hash per generare l'hash della password con il salt specificato. Restituisce l'hash generato*/
function generatePassword(password, salt){
    const cryptPassword = password + secret; 
    return bcrypt.hash(cryptPassword, salt);

}

/**
 * Genera un salt unico utilizzando la funzione bcrypt.genSalt
 * @returns salt generato
 */
function generateSalt(){
    return bcrypt.genSalt();
}


/*Confronta una password in chiaro con un hash di password utilizzando la funzione bcrypt.compare.
 Ritorna true se la password in chiaro corrisponde all'hash della password, altrimenti restituisce false.*/
function comparePass(plainPassword, hashPassword){
    return bcrypt.compare(plainPassword, hashPassword);
}

/*Questo modulo esporta le tre funzioni generatePassword, generateSalt e comparePass, 
consentendo ad altri file di importarle e utilizzarle per gestire l'hashing delle password.*/
module.exports = {generatePassword, generateSalt, comparePass};
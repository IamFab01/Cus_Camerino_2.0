require('dotenv').config();
// importa il modulo jsonwebtoken, che viene utilizzato per la generazione e la verifica dei token JWT
const jwt = require('jsonwebtoken');

//array che contiene tutti i refresh token memorizzati in memoria
let refreshTokens = [];

//aggiunge un token all'array refreshTokens.
function addRefreshToken(token) {
    this.refreshTokens.push(token);
    console.log("Token aggiunto : " + token);
}

//verifica se un determinato token è presente nell'array refreshTokens.
function containsToken(token) {
    return this.refreshTokens.includes(token);
}

/**
 * Funzione che restituisce il token di accesso JWT per l'utente.
 * @param {*} l'utente per il quale restituire il JWT.
 */
function getAccessTokenUser(user) {
    return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
}

/**
 * Funzione che restituisce il token di aggiornamento JWT per l'utente.
 * @param {*} user per il quale restituire il token di aggiornamento JWT. 
 */
function getRegfreshTokenUser(user) {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
}

/**
 * Funzione che restituisce il token di accesso JWT per il dipendente.
 * @param {*} employee per il quale restituire il JWT.
 */
function getAccessTokenEmployee(employee) {
    return jwt.sign({ id: employee.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
}

/**
 * Funzione che restituisce il token di aggiornamento JWT per il dipendente.
 * @param {*} the employee to returns the refresh JWT token.
 */
function getRegfreshTokenEmployee(employee) {
    return jwt.sign({ id: employee.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
}

/**
 * Funzione che restituisce l'utente tramite il token se possibile.
 * @param {String} token. 
 */
function getUserByToken(token) {
    let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!user) {
        return res.status(403).send("Token is not valid!");
    }
    return user;
}

/**
 * Funzione che restituisce il dipendente tramite il token se possibile.
 * @param {String} token.
 */
function getEmployeeByToken(token) {
    let employee = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!employee) return res.status(403).send("Token is not valid.");
    return employee;
}

/**
 * Funzione che restituisce l'utente tramite il token di aggiornamento se possibile. 
 * @param {String} token 
 */
function getUserByRefreshToken(token) {
    let user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!user) return res.status(403).send("Token is not valid!");
    return user;
}

/**
 * Funzione che restituisce il dipendente tramite il token di aggiornamento se possibile.
 * @param {String} token 
 */
function getEmployeeByRefreshToken(refreshToken) {
    let employee = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!employee) return res.status(403).send("Token is not valid");
    return employee;
}

/**
 * Middleware per verificare l'autorizzazione dell'utente.
 */
function authenticateTokenUser(req, res, next) {
    let authHeader = req.headers['authorization'];
    if (authHeader) {
        let token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send("Token is not valid!");
            req.user = user;
            next();
        })
    } else return res.status(401).send("You are not authenticated!");1
}

/**
 * Middleware per verificare l'autorizzazione del dipendente
 */
function authenticateTokenEmployee(req, res, next) {
    let authHeader = req.headers['authorization'];
    if (authHeader) {
        let token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send({
                status: 403, 
                message : "Token is not valid!",
            });
            req.user = user;
            next();
        })
    } else return res.status(401).send("You are not authenticated!");
}

module.exports =
{
    refreshTokens,
    getAccessTokenUser,
    getAccessTokenEmployee,
    getRegfreshTokenUser,
    getRegfreshTokenEmployee,
    getUserByToken,
    getEmployeeByToken,
    getUserByRefreshToken,
    getEmployeeByRefreshToken,
    authenticateTokenUser,
    authenticateTokenEmployee,
    addRefreshToken,
    containsToken,
};
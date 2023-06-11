/**
 * Questo file .js consente di esportare (poi importarlo nel server,
 * in questo caso index.js) tutte le rotte relative alle richieste
 * per il modello Utente.
 * @param {*} app da esportare.
 */
module.exports = app => {

    /**
     * Variabile utilizzata per indicare il controller corrispondente 
     * al modello Utente, in modo da chiamare i metodi corrispondenti
     * quando vengono effettuate le richieste.
     */
    const user = require('../controllers/user_controller');

    /**
     * Variabile che consente di chiamare metodi per l'autenticazione,
     * jwt e altro ancora.
     */
    const authenticate = require('../auth/jwtController.js');

    /**
     * Variabile utilizzata per il routing, consente di 
     * esportare questo file utilizzando il router dell'app 'express'.
     */
    var router = require('express').Router();



    /**
     * Questa rotta consente di registrare un nuovo
     * Utente nella piattaforma.
     */
    router.post("/registration", user.create);

    /**
     * Questa rotta consente all'Utente di effettuare il login.
     */
    router.post("/login", user.login);

    /**
     * Questa rotta consente di eseguire il logout dell'Utente
     * loggato nella piattaforma.
     */
    router.post("/logout", user.logout);

    /**
     * Questa rotta consente di ottenere un nuovo token di aggiornamento per l'Utente
     * loggato nella piattaforma.
     */
    router.post("/refreshToken",  user.refreshToken);

    /**
     * Questa rotta consente di aggiornare l'email per un Utente specifico, 
     * passando l'id corrispondente e unico come parametro.
     */
    router.post("/updateEmail/:id", authenticate.authenticateTokenUser, user.updateEmail); 

    /**
     * Questa rotta consente di aggiornare la password per un Utente specifico,
     * passando l'id corrispondente e unico come parametro.
     */
    router.post("/updatePassword/:id", authenticate.authenticateTokenUser, user.updatePassword); 

    /**
     * Questa rotta consente di eliminare un account Utente specifico, 
     * passando l'id corrispondente e unico come parametro.
     */
    router.post("/delete/:id", user.delete);

    /**
     * Questa rotta consente di ottenere un Utente specifico,
     * passando l'id corrispondente e unico come parametro.
     */
    router.get("/find/:id", user.find);

    /**
     * Questa rotta consente di ottenere tutti gli account Utente registrati.
     */
    router.get("/findAll", user.findAll);


    //Route per questo modulo:
    app.use('/api/user', router);

}
/**
 * Questo file .js consente di esportare (poi importarlo nel server,
 * in questo caso index.js) tutte le rotte relative alle richieste
 * per il modello della tessera
 * @param {*} app to export.
 */
module.exports = app => {

    /**
     * Variabile utilizzata per indicare il controller corrispondente 
     * al modello di tessera, in modo da chiamare i metodi corrispondenti
     * quando vengono effettuate le richieste.
     */
    const card = require('../controllers/card_controller.js');

    /**
     * Variabile che consente di chiamare metodi per l'autenticazione, jwt e altro ancora.
     */
    const authenticate = require('../auth/jwtController.js');

    /**
     * Variabile utilizzata per il routing, consente di esportare questo file utilizzando il router dell'app 'express'.
     */
    var router = require('express').Router();

    /**
     * Questa rotta consente di creare una nuova tessera per un utente registrato specifico.
     */
    router.post("/create", authenticate.authenticateTokenEmployee, card.create);

    /**
     * Questa rotta consente di eliminare una tessera specifica, passando l'id corrispondente e unico come parametro.
     */
    router.post("/delete/:id", authenticate.authenticateTokenEmployee, card.delete);

    /**
     * Questa rotta consente di aggiungere un numero specifico di punti, in una specifica Carta.
     */
    router.post("/addPoints", authenticate.authenticateTokenEmployee, card.addPoints);

    /**
     * Questa rotta consente di aggiungere un numero specifico di punti, in tutte le tessere esistenti
     */
    router.post("/addPointsAll", authenticate.authenticateTokenEmployee, card.addPointsAll);

    /**
     * Questa rotta consente di rimuovere un numero specifico di punti, in una specifica tessera.
     */
    router.post("/removePoints", authenticate.authenticateTokenEmployee, card.removePoints);

    /**
     * Questa rotta consente di rimuovere un numero specifico di punti, in tutte le tessere esistenti.
     */
    router.post("/removePointsAll", authenticate.authenticateTokenEmployee, card.removePointsAll);

    /**
     * Questa rotta consente di ottenere una tessera specifica, passando l'id corrispondente e unico come parametro.
     */
    router.get("/find/:id", card.find);

    /**
     * Questa rotta consente di ottenere una specifica tessera di un utente specifico, 
     * passando l'id corrispondente e unico come parametro.
     */
    router.get("/findCardUser/:id", authenticate.authenticateTokenUser, card.findCardUser);

    /**
     * Questa rotta consente di ottenere tutte le tessere create.
     */
    router.get("/findAll", authenticate.authenticateTokenEmployee, card.findAll);



    //Route for this module : 
    app.use('/api/card', router);
}
/**
 * Questo file .js consente di esportare (poi importarlo nel server,
 * in questo caso index.js) tutte le rotte relative alle richieste
 * per il modello dei premi
 * @param {*} app to export.
 */
module.exports = app => {

    /**
     * Variabile utilizzata per indicare il controller corrispondente
     * al modello dei premi, in modo da chiamare i metodi corrispondenti
     * quando vengono effettuate le richieste.
     */
    const gifts = require('../controllers/gifts_controller.js');

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
     * Questa rotta consente di creare un nuovo premio
     */
    router.post('/create', authenticate.authenticateTokenEmployee, gifts.create);

    /**
     * Questa rotta consente di aggiornare i dati di un Premio specifico,
     * passando l'id corrispondente e unico come parametro.
     */
    router.post('/update/:id', gifts.update);

    /**
     * Questa rotta consente di eliminare un Premio specifico,
     * passando l'id corrispondente e unico come parametro.
     */
    router.post('/delete/:id', authenticate.authenticateTokenEmployee, gifts.delete);

    /**
     * Questa rotta consente di ottenere i dati di un Premio specifico, 
     * passando l'id corrispondente e unico come parametro.
     */
    router.get('/find/:id', gifts.find);

    /**
     * Questa rotta consente di ottenere tutti i Premi creati, chiamati da un Dipendente loggato.
     */
    router.get('/findAllGiftsEmployee', authenticate.authenticateTokenEmployee, gifts.findAll);

    /**
     * Questa rotta consente di ottenere tutti i Premi creati, chiamati da un Utente loggato.
     */
    router.get('/findAllGiftsUser', authenticate.authenticateTokenUser, gifts.findAll);

    /**
     * Questa rotta consente di ottenere tutti i Premi ritirati dall'Utente, 
     * passando l'id corrispondente e unico come parametro.
     */
    router.get('/findAllUser/:id', authenticate.authenticateTokenUser, gifts.findAllUser);

    /**
     * Questa rotta consente di ottenere tutti gli Utenti che hanno riscattato
     * e si trovano nel processo di almeno un Premio.
     */
    router.post(`/findAllReedemByUser`, authenticate.authenticateTokenEmployee, gifts.findAllUserReedem);

    /**
     * Questa rotta consente di aggiungere un Premio specifico per un Utente specifico.
     */
    router.post('/addReward', authenticate.authenticateTokenUser, gifts.addReward);

    /**
     * Questa rotta consente di rimuovere un Premio specifico per un Utente specifico.
     */
    router.post('/removeReward', authenticate.authenticateTokenEmployee, gifts.removeReward);



    //Router for this Module.
    app.use('/api/gifts', router);

}
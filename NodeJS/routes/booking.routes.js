/**
 * Questo file .js consente di esportare (poi importarlo nel server,
 * in questo caso index.js) tutte le rotte relative alle richieste per il modello di Prenotazione.
 * @param {*} app to export.
 */
module.exports = app => {

    /**
     * Variabile utilizzata per indicare il controller corrispondente 
     * al modello di Prenotazione, in modo da chiamare i metodi corrispondenti
     * quando vengono effettuate le richieste.
     */
    const booking = require('../controllers/booking_controller.js');

    /**
     * Variabile che consente di chiamare metodi per l'autenticazione, jwt e altro ancora.
     */
    const authenticate = require('../auth/jwtController.js');

    /**
     * Variabile utilizzata per il routing, consente di esportare questo file utilizzando il router dell'app 'express'.
     */
    var router = require('express').Router();



    /**
     * Questa rotta consente di creare una nuova prenotazione.
     */
    router.put("/create", authenticate.authenticateTokenUser, booking.create);

    /**
     * Questa rotta consente di aggiornare una prenotazione, passando l'id corrispondente e unico come parametro.
     */
    router.post("/update/:id", authenticate.authenticateTokenEmployee,  booking.update);

    /**
     * Questa rotta consente di eliminare una specifica prenotazione, passando l'id corrispondente e unico come parametro.
     */
    router.delete("/delete/:id", authenticate.authenticateTokenUser, booking.delete);

    /**
     * Questa rotta consente di eliminare tutte le prenotazioni esistenti.
     */
    router.post("/deleteAll", authenticate.authenticateTokenEmployee, booking.deleteAll);

    /**
     * Questa rotta consente di ottenere una specifica prenotazione, passando l'id corrispondente e unico come parametro.
     */
    router.get("/find/:id", authenticate.authenticateTokenUser, booking.find);

    /**
     * Questa rotta consente di ottenere tutte le prenotazioni esistenti.
     */
    router.get("/findAll", authenticate.authenticateTokenEmployee, booking.findAll);

    /**
     * Questa rotta consente di ottenere tutte le prenotazioni per un utente specifico,
     * passando l'id corrispondente e unico come parametro.
     */
    router.get("/findAllUser", authenticate.authenticateTokenUser, booking.findOne);

    /**
     * TQuesta rotta consente di ottenere tutte le prenotazioni che non sono ancora state completate.
     */
    router.get("/findAllNotCompleted", authenticate.authenticateTokenUser, booking.findFreeBooking);

    /**
     * Questa rotta consente di ottenere tutte le prenotazioni che sono state completate.
     */
    router.get("/findAllCompleted", authenticate.authenticateTokenUser, booking.findAllCompleted);



    //Route for this module : 
    app.use('/api/booking', router);
}
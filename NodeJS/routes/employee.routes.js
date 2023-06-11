/**
 * Questo file .js consente di esportare (poi importarlo nel server,
 * in questo caso index.js) tutte le rotte relative alle richieste
 * per il modello Dipendente.
 * @param {*} app to export.
 */
module.exports = app => {

    /**
     * Variabile utilizzata per indicare il controller corrispondente
     * al modello Dipendente, in modo da chiamare i metodi corrispondenti
     * quando vengono effettuate le richieste.
     */
    const employee = require('../controllers/employee_controller.js');

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
     * Questa rotta consente di registrare un nuovo Dipendente nella piattaforma.
     */
    router.post("/registration", authenticate.authenticateTokenEmployee, employee.create);

    /**
     * Questa rotta consente al Dipendente di effettuare il login.
     */
    router.post("/login", employee.login);

    /**
     * Questa rotta consente di eseguire il logout del Dipendente loggato nella piattaforma.
     */
    router.post("/logout", employee.logout);

    /**
     * Questa rotta consente di ottenere un nuovo token di aggiornamento per il Dipendente loggato nella piattaforma.
     */
    router.post("/refreshToken", employee.refreshToken)

    /**
     * Questa rotta consente di rimuovere un account relativo al Dipendente, passando l'id corrispondente e unico come parametro.
     */
    router.delete("/delete/:id", authenticate.authenticateTokenEmployee, employee.delete);

    /**
     * Questa rotta consente di aggiornare i dati di un Dipendente specifico,
     * passando l'id corrispondente e unico come parametro.
     */
    router.post("/update/:id", authenticate.authenticateTokenEmployee, employee.update);

    /**
     * Questa rotta consente di ottenere un Dipendente specifico, passando l'id corrispondente e unico come parametro.
     */
    router.get("/find/:id", employee.find);

    /**
     * Questa rotta consente di ottenere tutti gli account Dipendente creati.
     */
    router.get("/findAll", authenticate.authenticateTokenEmployee, employee.findAll);



    //Route for this module : 
    app.use('/api/employee', router);
}
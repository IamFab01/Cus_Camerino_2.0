//Inizializzazione di Express

/*Viene importato il modulo Express.js e viene inizializzata un'istanza dell'applicazione Express chiamata app. 
Questa istanza sarà utilizzata per definire le route e configurare l'applicazione.*/
const express = require('express'); 
const app = express();


//Configurazione Express per gestire il parsing delle richieste

/*express.json() permette di analizzare il contenuto delle richieste con il tipo application/json*/
app.use(express.json());

/*express.urlencoded({ extended: true }) permette di analizzare il contenuto delle richieste 
con il tipo application/x-www-form-urlencoded*/
app.use(express.urlencoded({ extended: true })); 

//Importazione dei modelli e delle route

//Richiede il file per connettersi al DB
const db = require('./config/database.js');

//Richiesti per creare associazioni
const user = require('./models/user.js'); 
const gifts = require('./models/gifts.js'); 

//Queste definizioni delle route specificano come gestire le richieste HTTP per diverse risorse e definiscono le azioni da eseguire.
require('./routes/employee.routes.js')(app);
require('./routes/user.routes.js')(app);
require('./routes/card.routes.js')(app);
require('./routes/gifts.routes.js')(app); 
require('./routes/booking.routes.js')(app);

//Creazione delle associazioni tra modelli

/*Crea delle associazioni tra i modelli user e gifts utilizzando un modello di associazione UserRewards. 
Queste associazioni definiscono una relazione tra i modelli per eseguire operazioni 
come il recupero dei regali associati a un utente o degli utenti associati a un regalo.*/
user.belongsToMany(gifts, { through: 'UserRewards' } ); 
gifts.belongsToMany(user, { through: 'UserRewards'});

//Sincronizzazione del DB

/*Sincronizza il database con il metodo sync() fornito da db.
Una volta che la sincronizzazione è completata, viene stampato il messaggio "Synced db.". 
Se si verifica un errore durante la sincronizzazione, viene stampato un messaggio di errore.*/
db.sync().then(() => {
    console.log("Synced db."); 
}).catch((err) => {
    console.log("Failed to sync db : " + err.message);
}); 

//Avvio del Server in ascolto sulla porta 3000
app.listen(3000); 
console.log("Server start at 3000...");
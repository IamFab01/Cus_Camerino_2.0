import { Injectable } from '@angular/core';
import { User } from '../Models/user';
import { Employee } from '../Models/employee';

//Invia dati al percorso radice.
@Injectable({
    providedIn : 'root'
})

/**
 * Classe che funge da servizio per inviare
 * un utente loggato ad altri componenti del progetto.
 * Sarà utilizzato per inviare l'utente loggato alla dashboard.
 */
export class UserService{

    /**
     * Variabile a cui sarà associato un utente loggato mediante il metodo set.
     */
    private user : User | Employee | undefined;

    // Costruttore per questo componente.
    constructor(){}

    /**
     * Metodo che consente di impostare un utente loggato alla variabile sopra indicata.
     * Questo metodo viene chiamato nel componente di accesso sia per gli utenti.
     */
    setUser(user: User | Employee){
        this.user = user;
    }

    /**
     * Metodo che consente di ottenere l'oggetto Utente.
     */
    getUser(){
        return this.user;
    }
}

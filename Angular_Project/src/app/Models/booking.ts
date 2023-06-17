import { Time } from "@angular/common";

export class Booking {
    id: Number;
    nome: String;
    cognome: String;
    dataPrenotazione: Date;
    oraInizio: Time;
    oraFine: Time;
    completata: Number;


    constructor(
        id: Number,
        nome: String,
        cognome: String,
        dataPrenotazione: Date,
        oraInizio: Time,
        oraFine: Time,
        completata: Number,
    ) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.dataPrenotazione = dataPrenotazione;
        this.oraInizio = oraInizio;
        this.oraFine = oraFine;
        this.completata = completata;
    }

    setCompletata(completata: Number): void {
        this.completata = completata;
    }

    getCompletata(): Number {
        return this.completata;
    }

    getId(): Number {
        return this.id;
    }

    getDataPrenotazione(): Date {
        return this.dataPrenotazione;
    }

    setDataPrenotazione(dataPrenotazione: Date): void {
        this.dataPrenotazione = dataPrenotazione;
    }

}

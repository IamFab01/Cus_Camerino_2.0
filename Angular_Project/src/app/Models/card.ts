
export class Card{
    id : Number;
    idUtente : Number; 
    codice : String; 
    punti : Number; 
    owner : {
        nome: String, 
        cognome:String,
    }


    constructor(id: Number, idUtente : Number, codice : String, punti : Number, owner : any){

        this.id = id;
        this.idUtente = idUtente;
        this.codice = codice;
        this.punti = punti;
        this.owner = owner; 
    }

    getPunti() {
        return this.punti;
    }

}
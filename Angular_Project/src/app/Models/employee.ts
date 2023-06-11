export class Employee{
    id: Number;
    nome: String;
    codice : String;
    restrizioni : Number;

    constructor(id: Number, nome: String, codice: String, restrizioni : Number){
        this.id = id; 
        this.nome = nome; 
        this.codice = codice; 
        this.restrizioni = restrizioni;
    }

    getId(){
        return this.id;
    }
    
    getNome(){
        return this.nome; 
    }

    setNome(nome: String){
        if(nome == ""){
            throw console.error("Nome can't be null.");
        }
        this.nome = nome; 
    }

    getCodice(){
        return this.codice; 
    }

    setCodice(codice : String){
        if(codice == null){
            throw console.error("Id can't be null.");
        }
        this.codice = codice; 
    }
}
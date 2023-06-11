export class Gift{
    id : Number;
    nome : String; 
    punti : Number;
    UserRewards : {
        UserId : Number, 
        GiftId : Number,
    }

    constructor(id : Number, nome : String, punti : Number, userReward : any){
        this.id = id;
        this.nome = nome;
        this.punti = punti;
        this.UserRewards = userReward;
    }
}
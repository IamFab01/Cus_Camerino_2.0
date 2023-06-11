const User = require('./user.js'); 
const Gifts = require('./gifts.js'); 



function associate(){

    User.belongsToMany(Gifts, { through: 'UserRewards' } );

    Gifts.belongsToMany(User, { through: 'UserRewards' });
}

module.exports = associate;
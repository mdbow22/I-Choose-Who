const User = require('./users');
const Pokemon = require('./pokemon');
const UsersPokemon = require('./usersPokemon');

User.belongsToMany(Pokemon, {through: UsersPokemon});

Pokemon.belongsToMany(User, {through: UsersPokemon});

module.exports = { User, Pokemon, UsersPokemon };
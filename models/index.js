const User = require('./users');
const Pokemon = require('./pokemon');
const UsersPokemon = require('./usersPokemon');

User.belongsToMany(Pokemon, {
    through: UsersPokemon,
    foreignKey: 'user_id',
    otherKey: 'pokemon_id'
});

Pokemon.belongsToMany(User, {
    through: UsersPokemon,
    foreignKey: 'pokemon_id',
    otherKey: 'user_id'
});

module.exports = { User, Pokemon, UsersPokemon };
const sequelize = require('../config/connection');
const seedPokemon = require('./pokemon');
const seedUsers = require('./users');
const UsersPokemon = require('../models/usersPokemon');

const seedAll = async () => {
    await sequelize.sync({ force: true });
  
    await seedPokemon();
    await seedUsers();

    for(let k = 0; k < 100; k++) {
      
      //randomly set values
      let value = (Math.random() < 0.5) ? 0 : 1;
      let userID = Math.floor((Math.random() * 10) + 1);
      let pokemonID = Math.floor((Math.random() * 815) + 1);

      const newPokemon = await UsersPokemon.create({
        user_id: userID,
        pokemon_id: pokemonID,
        favorite: value
      });

    }
    
  
    process.exit(0);
  };

  seedAll();
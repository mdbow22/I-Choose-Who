const sequelize = require('../config/connection');
const seedPokemon = require('./pokemon');
const seedUsers = require('./users');

const seedAll = async () => {
    await sequelize.sync({ force: true });
  
    await seedUsers();
    await seedPokemon();
  
    process.exit(0);
  };
  
  seedAll();
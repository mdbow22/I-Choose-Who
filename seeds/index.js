const sequelize = require('../config/connection');
const seedUsers = require('./users');

const seedAll = async () => {
    await sequelize.sync({ force: true });
  
    await seedUsers();
  
    process.exit(0);
  };
  
  seedAll();
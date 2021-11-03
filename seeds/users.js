const { User } = require('../models');

const userData = [
    {
    "email": "pokemaster@gmail.com",
    "password": "pikachu25"
  }, {
    "email": "omerkle1@narod.ru",
    "password": "qrzOWteuJuu8"
  }, {
    "email": "kcroster2@wikia.com",
    "password": "3ZYJz6WVd"
  }, {
    "email": "gbraams3@bravesites.com",
    "password": "nK752rc"
  }, {
    "email": "iroggero4@yahoo.com",
    "password": "fYBP3Jv0G15"
  }, {
    "email": "scrippell5@princeton.edu",
    "password": "sxM4Mf369ZI"
  }, {
    "email": "amaccaull6@europa.eu",
    "password": "4YwiTdixj"
  }, {
    "email": "stomasian7@newsvine.com",
    "password": "PTQi8Fh3j4K"
  }, {
    "email": "rledstone8@slashdot.org",
    "password": "DoMKxZ"
  }, {
    "email": "eiremonger9@google.nl",
    "password": "KXocTejv"
  }]

const seedUsers = () => User.bulkCreate(userData, {individualHooks: true});

module.exports = seedUsers;
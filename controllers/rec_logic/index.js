const {Pokemon, UsersPokemon } = require('../../models');
const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();

//when pulling pokemon from collection, map to have just name (and include -alola or -galar for those)
const collection = ['Vaporeon','Flareon','Jolteon','Leafeon','Glaceon','Umbreon','Espeon','Sylveon','Dragonite','Graveler','Sandslash','Steelix','Eevee','Scizor','Machamp','Muk'];

//have enemy team come in as array to make passing it to pokedex easier
let enemyCollection = ['Zubat','Tentacool','Rattata'];


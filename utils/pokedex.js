const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();

/**
 * Fetches URLs for an array of pokemon objects and adds that information as the property
 * 'imageURL' on each pokemon object in the array.
 * @param {Array<Object>} pokemonList - An array of pokemon objects based on Pokemon model 
 * @returns {Array<Object>} The original array with 'imageURL' added as a property to each element.
 */
const getPics = async (pokemonList) => { 

  if (pokemonList.length < 1) {
    return [];
  }

  //create array of pokemon names to fetch
  const pokemonNamesToFetch = pokemonList.map(pokemon => {
    switch (pokemon.name) {
      case 'Nidoran♂':
        return 'nidoran-m';
      case 'Nidoran♀':
        return 'nidoran-f';
      default:
        return pokemon.name.toLowerCase().replace(' ', '-').replace(/[^a-z\-0-9]/g, '')
               + (pokemon.variant ? '-' + pokemon.variant.toLowerCase() : '');
    }
  });

  //fetch data from PokeAPI
  const pokeData = await P.getPokemonByName(pokemonNamesToFetch);


  //add pic for each pokemon
  pokemonList.forEach((pokemon, i) => {
    // pokemon.imageURL = pics[i].spriteUrl;
    pokemon.imageURL = pokeData[i].sprites.front_default;
  });

  return pokemonList;
}

P.getPics = getPics;

module.exports = P;
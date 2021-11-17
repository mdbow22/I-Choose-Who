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

/**
 * 
 * Fetches data about the effectiveness of types against specific pokemon for recommendations
 * 
 * @param {Array<Object>} team - an array of pokemon objects based on pokemon model
 * @returns {Array<Object>} - original array with type info added
 */

const getTypeInfo = async (team) => {
    
  //Determine weaknesses
  for(const pokemon of team) {
      const typeInfo = await P.getTypeByName(pokemon.types);

      typeInfo.forEach((type) => {
          //map what types pokemon is weak to
          if(pokemon.weak_to) {
              pokemon.weak_to = (pokemon.weak_to.concat(type.damage_relations.double_damage_from.map((type) => type.name)));
          } else {
              pokemon.weak_to = type.damage_relations.double_damage_from.map(el => el.name);
          }
          
          //map what types pokemon resists
          if(pokemon.resists) {
              pokemon.resists = [...new Set(pokemon.resists.concat(type.damage_relations.half_damage_from.map((type) => type.name)))];
          } else {
              pokemon.resists = type.damage_relations.half_damage_from.map(el => el.name);
          }

          //map what types pokemon is immune to
          if(pokemon.immune_to) {
              pokemon.immune_to = [...new Set(pokemon.immune_to.concat(type.damage_relations.no_damage_from.map((type) => type.name)))];
          } else {
              pokemon.immune_to = type.damage_relations.no_damage_from.map(el => el.name);
          }

          //map what types pokemon is strong against
          if(pokemon.strong_against) {
              pokemon.strong_against = [...new Set(pokemon.strong_against.concat(type.damage_relations.double_damage_to.map((type) => type.name)))];
          } else {
              pokemon.strong_against = type.damage_relations.double_damage_to.map(el => el.name);
          }
      });
      
      //determine 4x weak_to
      pokemon.weak_to4x = [];

      pokemon.weak_to.forEach((type) => {
          const restOfArray = pokemon.weak_to.slice(pokemon.weak_to.indexOf(type) + 1);
          if(restOfArray.includes(type)) {
              pokemon.weak_to4x.push(type);
              pokemon.weak_to.splice(pokemon.weak_to.indexOf(type), 1);
          }
      });

      //remove 4x weak types from regular weak_to array
      pokemon.weak_to4x.forEach((type) => {
          if (pokemon.weak_to.includes(type)) {
              pokemon.weak_to.splice(pokemon.weak_to.indexOf(type), 1);
          }
      });

      //if a type appears in both weak_to and resists, remove it from both
      for(let i = 0; i < pokemon.weak_to.length; i++) {
          if (pokemon.resists.includes(pokemon.weak_to[i])) {
              //remove from resists
              pokemon.resists.splice(pokemon.resists.indexOf(pokemon.weak_to[i]), 1);
              //remove from weak_to
              pokemon.weak_to.splice(i, 1);
          }
      }

      //remove immune_to types from weak_to list
      pokemon.weak_to.forEach((type) => {
          if(pokemon.immune_to.includes(type)) {
              pokemon.weak_to.splice(pokemon.weak_to.indexOf(type), 1);
          }
      });
  }

  

  return team;
}

P.getTypeInfo = getTypeInfo;

module.exports = P;
const { Pokemon } = require('../models');
const allPokemon = require('./pokemon_types.json');

const pokemonSeeds = () => {
    
    let seedArray = [];
    
    for(let i = 0; i < allPokemon.length; i++) {
        
        let seedObj = {};

        if(allPokemon[i].form === 'Normal' || allPokemon[i].form === 'Galarian' || allPokemon[i].form === 'Alola') {
            seedObj.pokedex_id = allPokemon[i].pokemon_id;
            seedObj.name = allPokemon[i].pokemon_name;

            if(allPokemon[i].form === 'Galarian') {
                seedObj.variant = 'galar';
            } else if(allPokemon[i].form === 'Alola') {
                seedObj.variant = 'alola'; 
            }

            seedArray.push(seedObj);
        }
    }

    return seedArray;

    };

const seedPokemon = () => Pokemon.bulkCreate(pokemonSeeds());

module.exports = seedPokemon;






const {Pokemon, UsersPokemon } = require('../../models');
const Pokedex = require('pokedex-promise-v2');
const {Op} = require('sequelize');

const P = new Pokedex();

//when pulling pokemon from collection, map to have just name (and include -alola or -galar for those)
const collection = ['Vaporeon','Flareon','Jolteon','Leafeon','Glaceon','Umbreon','Espeon','Sylveon','Dragonite','Graveler','Sandslash','Steelix','Eevee','Scizor','Machamp','Muk'];

//have enemy team come in as array to make passing it to pokedex easier
let enemyCollection = ['Zubat','Tentacool','Tauros','Dragonite'];

//Pull enemy pokemon from database with typing

const team = async (enemyPokemon) => {
    //Find pokemon in database - will have to figure out how to account for alolan/galarian pokemon
    const pokemon = await Pokemon.findAll({
        where: {
            name: {[Op.in]: enemyPokemon}
        }
    });

    const plainPokemon = pokemon.map((pokemon) => pokemon.get({plain: true}));
    const array = plainPokemon.map((pokemon) => {
        if(pokemon.type2) {
            return {name: pokemon.name, types: [pokemon.type1.toLowerCase(), pokemon.type2.toLowerCase()]};
        } else {
            return {name: pokemon.name, types: [pokemon.type1.toLowerCase()]};
        }
    });

    return array;
};

//Add strengths and weaknesses to user and enemy teams
const getTypeInfo = async () => {

    //Get type info from database
    const enemyTeam = await team(enemyCollection);
    const userTeam = await team(collection);

    //Determine enemy weaknesses
    for(const pokemon of enemyTeam) {
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
    }

    /* //determine users strengths
    for(const pokemon of userTeam) {
        const typeInfo = await P.getTypeByName(pokemon.types);
        if(pokemon.types.length > 1) {
            
        } else {
            
            //map what types pokemon is strong against  
            if(typeInfo[0].damage_relations.double_damage_to.length > 0) {
                pokemon.strong_against = typeInfo[0].damage_relations.double_damage_to.map(el => el.name);
            }
            
            //map what types pokemon is weak against
            if(typeInfo[0].damage_relations.half_damage_to.length > 0) {
                pokemon.weak_against = typeInfo[0].damage_relations.half_damage_to.map(el => el.name);
            }

            //map what types pokemon is immune to
            if(typeInfo[0].damage_relations.no_damage_to.length > 0) {
                pokemon.immune_to = typeInfo[0].damage_relations.no_damage_to.map(el => el.name);
            }
        }
    } */

    console.log(enemyTeam);
    //console.log(userTeam);
}

const getRecommendations = async () => {

};

getTypeInfo();

const {Pokemon, UsersPokemon } = require('../../models');
const Pokedex = require('pokedex-promise-v2');
const {Op} = require('sequelize');

const P = new Pokedex();

//when pulling pokemon from collection, map to have just name (and include -alola or -galar for those)
const collection = ['Vaporeon','Flareon','Jolteon','Leafeon','Glaceon','Umbreon','Espeon','Sylveon','Dragonite','Graveler','Sandslash','Steelix','Eevee','Scizor','Machamp','Muk'];

//have enemy team come in as array to make passing it to pokedex easier
let enemyCollection = ['Zubat','Tentacool','Tauros'];

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
                pokemon.weak_to = [...new Set(pokemon.weak_to.concat(type.damage_relations.double_damage_from.map((type) => type.name)))];
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
    }

    //determine users strengths
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
    }

    console.log(enemyTeam);
    //console.log(userTeam);
}

getTypeInfo();

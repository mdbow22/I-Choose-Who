const {Pokemon, UsersPokemon } = require('../../models');
const Pokedex = require('pokedex-promise-v2');
const {Op} = require('sequelize');
const P = require('../../utils/pokedex')
// const P = new Pokedex();

//Pull enemy pokemon from database with typing

const team = async (enemyPokemon) => {
    //Find pokemon in database - will have to figure out how to account for alolan/galarian pokemon
    const pokemon = await Pokemon.findAll({
        where: {
            id: {[Op.in]: enemyPokemon}
        }
    });

    const plainPokemon = pokemon.map((pokemon) => pokemon.get({plain: true}));
    const array = plainPokemon.map((pokemon) => {
        if(pokemon.type2) {
            return {name: pokemon.name, variant: pokemon.variant, types: [pokemon.type1.toLowerCase(), pokemon.type2.toLowerCase()]};
        } else {
            return {name: pokemon.name, variant: pokemon.variant, types: [pokemon.type1.toLowerCase()]};
        }
    });

    return array;
};

const removeImmunities = (userTeam, enemy) => {
    let rec_team = userTeam.filter(userMon => {
        if(userMon.types.length === 1 && enemy.immune_to.includes(userMon.types[0])) {
            return false;
        } else {
            return true;
        }
    });

    return rec_team;
}

const removeWeakPokemon = (userTeam, enemy) => {
    let rec_team = userTeam.filter(userMon => {
        if(enemy.strong_against.includes(userMon.types[0]) || enemy.strong_against.includes(userMon.types[1])) {
            return false;
        } else {
            return true;
        }
    });

    return rec_team;
};

const getRecommendations = async (userTeam, enemy) => {

    //Get info about enemy team from our DB
    const enemyTeam = await team(enemy);

    //retrieve type information about enemy and user teams
    await Promise.all([P.getTypeInfo(enemyTeam), P.getTypeInfo(userTeam)]);
    
    for(const pokemon of enemyTeam) {
        pokemon.best = [];
        pokemon.better = [];
        pokemon.good = [];


        //build rec_team array of pokemon suitable for recommendation
        rec_team = [];

        //remove pokemon that have no effect on enemy pokemon
        if(pokemon.immune_to.length) {
            rec_team = removeImmunities(userTeam, pokemon);
        } else {
            rec_team = userTeam;
        }

        //remove pokemon that are weak to enemy
        rec_team = removeWeakPokemon(rec_team, pokemon);

        rec_team.forEach((userMon) => {
            //determine options

            //options if pokemon has 4xweak types
            if(pokemon.weak_to4x.length) {

                //best options -> pokemon with at least 1 type that's 4x effective against enemy
                if(pokemon.weak_to4x.includes(userMon.types[0]) || pokemon.weak_to4x.includes(userMon.types[1])) {
                    pokemon.best.push(userMon);
                }
                //better options -> pokemon with at least 1 type that's 2x effective against enemy
                else if(pokemon.weak_to.includes(userMon.types[0]) || pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.better.push(userMon);
                //good options -> pokemon that the enemy at least doesn't resist
                } else if (userMon.types.length === 2) {
                    //good options if double type
                    if(!pokemon.resists.includes(userMon.types[0]) && !pokemon.resists.includes(userMon.types[1])) {
                        pokemon.good.push(userMon);
                    }
                } else {
                    //good options if single type
                    if(!pokemon.resists.includes(userMon.types[0])) {
                        pokemon.good.push(userMon);
                    }
                }

            } else {
                //best options if no weak_to4x -> both types 2x effective against enemy
                //Revisit: odd choice that only dual-types can be "best" against single-type enemies
                if(pokemon.weak_to.includes(userMon.types[0]) && pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.best.push(userMon);
                //better options -> at least one type 2x effective against enemy
                } else if (pokemon.weak_to.includes(userMon.types[0]) || pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.better.push(userMon);
                //good options -> pokemon that the enemy at least doesn't resist
                } else if (userMon.types.length === 2) {
                    //good options if double type
                    if(!pokemon.resists.includes(userMon.types[0]) && !pokemon.resists.includes(userMon.types[1])) {
                        pokemon.good.push(userMon);
                    }
                } else {
                    //good options if single type
                    if(!pokemon.resists.includes(userMon.types[0])) {
                        pokemon.good.push(userMon);
                    }
                }
            }

        });

        //sort pokemon so favorites are first
        pokemon.best.sort((pokeA, pokeB) => {
            return (pokeA.favorite > pokeB.favorite ) ? -1 : ((pokeB.favorite > pokeA.favorite) ? 1 : 0);
        });
    
        pokemon.better.sort((pokeA, pokeB) => {
            return (pokeA.favorite > pokeB.favorite ) ? -1 : ((pokeB.favorite > pokeA.favorite) ? 1 : 0);
        });
    
        pokemon.good.sort((pokeA, pokeB) => {
            return (pokeA.favorite > pokeB.favorite ) ? -1 : ((pokeB.favorite > pokeA.favorite) ? 1 : 0);
        });

        //eliminate options after 8
        if(pokemon.best.length > 8) {
            pokemon.best.splice(8);
        }

        if(pokemon.better.length > 8) {
            pokemon.better.splice(8);
        }

        if(pokemon.good.length > 8) {
            pokemon.good.splice(8);
        }

        await Promise.all([
            P.getPics(pokemon.best),
            P.getPics(pokemon.better),
            P.getPics(pokemon.good)
        ]);
    }

    await P.getPics(enemyTeam);

    return enemyTeam;
};

module.exports = { getRecommendations };
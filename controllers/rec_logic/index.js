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

const getRecommendations = async (userTeam, enemy) => {

    //Placeholder for call to database to fetch user's collection
    const enemyTeam = await team(enemy);

    //retrieve type information about enemy and user teams
    await P.getTypeInfo(enemyTeam);
    await P.getTypeInfo(userTeam);

    /**
     * Iterate over enemy team:
     * 
     * If enemyMon has immunity = exclude all in collection that are that single type
     * 
     * If enemyMon has weak_to4x category, find all pokemon in collection:
     *  Best pokemon = 2 4xWeak types or 4xWeak
     *  Better pokemon = 2 weak types
     *  Good pokemon = no resistances
     * 
     * 
     * If enemyMon doesn't have weak_to4x category:
     *  best = 2 weak types
     *  better = 1 weak
     *  good = no resistances
     * 
     * Alternative Points system:
     * 4x weak type = 2 points
     * weak type = 1 point
     * not resisted = 0 points
     * resisted = -1 points
     * immune = -2 points
     * immune-to-enemy = 1 point
     * 
     * If list of recommendations empty: "You have no pokemon for this battle"
     */
    
    for(const pokemon of enemyTeam) {
        pokemon.best = [];
        pokemon.better = [];
        pokemon.good = [];

        /**
         * New Logic:
         * Eliminate pokemon 3 types of pokemon - 
         * 1. Pokemon that have no effect on enemy
         * 2. Pokemon that are weak to enemy
         */

        /**
         * Original Recommendation logic:
         * Issues: iterates through entire collection,
         * doesn't account for pokemon that are weak to the enemy pokemon
         */

        //remove pokemon from userTeam if enemy has immunity
        rec_team = [];

        if(pokemon.immune_to.length) {
            rec_team = userTeam.filter(userMon => {
                if(userMon.types.length === 1 && pokemon.immune_to.includes(userMon.types[0])) {
                    return false;
                } else {
                    return true;
                }
            })
        } else {
            rec_team = userTeam;
        }

        //remove pokemon that are weak to enemy


        userTeam.forEach((userMon) => {
            //determine options

            //options if pokemon has 4xweak types
            if(pokemon.weak_to4x.length) {

                //best options
                if(pokemon.weak_to4x.includes(userMon.types[0]) || pokemon.weak_to4x.includes(userMon.types[1])) {
                    pokemon.best.push(userMon);
                }
                /* pokemon.weak_to4x.forEach((type) => {
                    if(userMon.types.includes(type)) {
                        pokemon.best.push(userMon);
                    }
                }); */

                //better options
                if(pokemon.weak_to.includes(userMon.types[0]) && pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.better.push(userMon);
                //good options
                } else if (pokemon.weak_to.includes(userMon.types[0]) || pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.good.push(userMon);
                }

            } else {
                //best options if no weak_to4x
                if(pokemon.weak_to.includes(userMon.types[0]) && pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.best.push(userMon);
                //better options
                } else if (pokemon.weak_to.includes(userMon.types[0]) || pokemon.weak_to.includes(userMon.types[1])) {
                    pokemon.better.push(userMon);
                //good options
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
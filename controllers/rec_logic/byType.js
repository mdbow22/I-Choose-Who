const {Pokemon, UsersPokemon } = require('../../models');
const Pokedex = require('pokedex-promise-v2');
const {Op} = require('sequelize');

const P = new Pokedex();

const type = 'ghost';
const userCollection = ['Vaporeon','Flareon','Jolteon','Leafeon','Glaceon','Umbreon','Espeon','Sylveon','Dragonite','Graveler','Sandslash','Steelix','Eevee','Scizor','Machamp','Misdreavus'];

//get typeinfo for type selected
const typeInfo = async (type) => {
    const info = await P.getTypeByName(type);

    const typeEffectiveness = {
        immune_to: info.damage_relations.no_damage_from.map(types => types.name),
        weak_to: info.damage_relations.double_damage_from.map(types => types.name),
        resists: info.damage_relations.half_damage_from.map(types => types.name),
        strong_against: info.damage_relations.double_damage_to.map(types => types.name)
    }

    return typeEffectiveness;
}

const recsFromType = async (userCollection, type) => {
    const typeData = await typeInfo(type);

    typeData.best = [];
    typeData.better = [];
    typeData.good = [];

    for(const pokemon of userCollection) {

        //make type data from db lowercase
        let types = pokemon.types.map(type => type.toLowerCase());
        
        //check single type pokemon in collection first
        if(types.length === 1) {
            //exclude pokemon that can't deal damage b/c of immunity
            if(!typeData.immune_to.includes(types[0])) {
                //add to better if type is super-effective
                if(typeData.weak_to.includes(types[0])) {
                    typeData.better.push(pokemon);
                //add to good if pokemon is at least not resisted by or weak to enemy type
                } else if(!typeData.resists.includes(types[0]) && !typeData.strong_against.includes(types[0])) {
                    typeData.good.push(pokemon);
                }
            }
        } 
             //exclude pokemon where both types can't deal damage b/c immunity
        else if(!typeData.immune_to.includes(types[0]) && !typeData.immune_to.includes(types[1])) {
            //add to best if both types are super-effective
            if(typeData.weak_to.includes(types[0]) && typeData.weak_to.includes(types[1])) {
                typeData.best.push(pokemon);
            //add to better if one type is super-effective and other type is not resisted or weak to enemy's type
            } else if(typeData.weak_to.includes(types[0]) && 
                       !typeData.resists.includes(types[1]) && 
                       !typeData.strong_against.includes(types[1])) {
                        typeData.better.push(pokemon);

                    } else if(typeData.weak_to.includes(types[1]) && 
                    !typeData.resists.includes(types[0]) && 
                    !typeData.strong_against.includes(types[0])) {

                        typeData.better.push(pokemon);
                    }
            //add to good if no type is resisted or weak to enemy's type
            else if((!typeData.resists.includes(types[0]) && !typeData.strong_against.includes(types[0])) &&
                     (!typeData.resists.includes(types[1]) && !typeData.strong_against.includes(types[1]))) {
                typeData.good.push(pokemon);
            }
        } 
    }

    return typeData;
};

module.exports = { recsFromType }
const router = require('express').Router();
const { getRecommendations } = require('../rec_logic/index');
const { recsFromType } = require('../rec_logic/byType');
const { Pokemon, User } = require('../../models');


router.post('/', async (req, res) => {
    try {
        //get user's pokemon
        const userCollection = await User.findByPk(1, {
            include: [{
                    model: Pokemon,
                    through: {
                        attributes: ['favorite']
                    }
                    }]
        } /*req.session.userId*/);

        //create an array of pokemon, where types become array instead of separate properties
        const collection = userCollection.pokemons.map((pokemon) => {
            if(pokemon.type2) {
                return {name: pokemon.name, variant: pokemon.variant, favorite: pokemon.users_pokemon.favorite, types: [pokemon.type1, pokemon.type2]};
            } else {
                return {name: pokemon.name, variant: pokemon.variant,  favorite: pokemon.users_pokemon.favorite, types: [pokemon.type1]};
            }
        });

        //get recommendations
        const recommendations = await getRecommendations(collection, req.body.pokemon);

        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

});

router.post('/:type', async (req, res) => {

    try {
        //get user's pokemon
    const userCollection = await User.findByPk(1 /*req.session.userId*/, {
        include: [{
                model: Pokemon,
                through: {
                    attributes: ['favorite']
                }
                }]
    } /*req.session.userId*/);

    //create an array of pokemon, where types become array instead of separate properties
    const collection = userCollection.pokemons.map((pokemon) => {
        if(pokemon.type2) {
            return {name: pokemon.name, variant: pokemon.variant, favorite: pokemon.users_pokemon.favorite, types: [pokemon.type1, pokemon.type2]};
        } else {
            return {name: pokemon.name, variant: pokemon.variant, favorite: pokemon.users_pokemon.favorite, types: [pokemon.type1]};
        }
    });

    const recommendations = await recsFromType(collection, req.params.type);

    res.status(200).json(recommendations);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;
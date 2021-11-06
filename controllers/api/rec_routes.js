const router = require('express').Router();
const { getRecommendations } = require('../rec_logic/index');
const { Pokemon, User } = require('../../models');


router.post('/', async (req, res) => {
    try {
        //get user's pokemon
        const userCollection = await User.findByPk(1, {
            include: [{
                    model: Pokemon
                    }]
        } /*req.session.userId*/);

        //create an array of pokemon, where types become array instead of separate properties
        const collection = userCollection.pokemons.map((pokemon) => {
            if(pokemon.type2) {
                return {name: pokemon.name, types: [pokemon.type1, pokemon.type2]};
            } else {
                return {name: pokemon.name, types: [pokemon.type1]};
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

module.exports = router;
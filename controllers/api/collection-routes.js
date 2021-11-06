const router = require('express').Router();
const { User, Pokemon, UsersPokemon } = require('../../models');

// add pokemon to collection
router.post('/add', async (req, res) => {

    const newPokemon = req.body.pokemonIds.map(pokemonId => {
        return {
            user_id: req.session.userId,
            pokemon_id: pokemonId,
            favorite: 0
        }
    });

    try {
        const addPoke = await UsersPokemon.bulkCreate(newPokemon);

        res.status(200).json(addPoke);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    
});

// turn on favorite
router.put('/favorite/:id', async (req, res) => {

    try {

        const favPoke = await UsersPokemon.update({
            favorite: 1
        }, 
        {
            where: {
                pokemon_id: req.params.id,
                user_id: req.session.userId
            }            
        });

        res.status(200).json(favPoke);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// turn off favorite
router.put('/unfavorite/:id', async (req, res) => {

    try {
        const unfavPoke = await UsersPokemon.update({
            favorite: 0
        }, 
        {
            where: {
                pokemon_id: req.params.id,
                user_id: req.session.userId
            }            
        });

        res.status(200).json(unfavPoke);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// remove pokemon from collection
router.delete('/delete/:id', async (req, res) => {

    try {
        const deletePoke = await UsersPokemon.destroy({
            where: {
                pokemon_id: req.params.id,
                user_id: req.session.userId
            }         
        });

        res.status(200).json(deletePoke);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
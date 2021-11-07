const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Pokemon, UsersPokemon } = require('../models')

router.get('/', async (req, res) => {
    res.render('homepage', { loggedIn: req.session.loggedIn, email: req.session.email })
});

router.get('/collection', withAuth, async (req, res) => {
    try {
        const usersPoke = await User.findByPk(req.session.userId, {include: [{model: Pokemon}] });
        const usersPokePlain = usersPoke.get({plain:true});
        console.log(usersPokePlain)
        const collection = [];

        if (usersPokePlain.pokemons){
            for (i=0;i<usersPokePlain.pokemons.length;i++){

                const pokemon = {};
    
                pokemon["id"] = usersPokePlain.pokemons[i].id;
                pokemon["pokedex_id"] = usersPokePlain.pokemons[i].pokedex_id;
                pokemon["name"] = usersPokePlain.pokemons[i].name;
                pokemon["type1"] = usersPokePlain.pokemons[i].type1;
                pokemon["type2"] = usersPokePlain.pokemons[i].type2;
                pokemon["variant"] = usersPokePlain.pokemons[i].variant;
                pokemon["favorite"] = usersPokePlain.pokemons[i].users_pokemon.favorite;
                pokemon["createdAt"] = usersPokePlain.pokemons[i].users_pokemon.createdAt;
    
                collection.push(pokemon);
    
            }
        }

        // console.log(collection);

        res.render('mypokollection', { collection, loggedIn: req.session.loggedIn, email: req.session.email });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
    
});

router.get('/recommendations', withAuth, async (req, res) => {
    res.render('recommendations', { loggedIn: req.session.loggedIn, email: req.session.email })
});

router.get('/login', async (req, res) => {
    res.render('login', {});
});

module.exports = router;
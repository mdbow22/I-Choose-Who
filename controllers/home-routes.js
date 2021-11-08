const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Pokemon, UsersPokemon } = require('../models');
// const sequelize = require('../config/connection');
const {Op} = require('sequelize');

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const imageInfo = async (name) => {
    
    try {
        const poke = await P.getPokemonByName(name);
        const pokeImage = poke.sprites.front_default
        console.log(pokeImage)
        return pokeImage;
    } catch(err) {
        console.log(err);
    }

}

router.get('/', async (req, res) => {
    res.render('homepage', { loggedIn: req.session.loggedIn, email: req.session.email })
});

router.get('/collection', withAuth, async (req, res) => {
    try {
        const usersPoke = await User.findByPk(req.session.userId, {include: [{model: Pokemon}] });
        const usersPokePlain = usersPoke.get({plain:true});
        
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
                
                if (usersPokePlain.pokemons[i].variant){
                   const lowerCaseName = usersPokePlain.pokemons[i].name.toLowerCase();
                   const lowerCaseVariant = usersPokePlain.pokemons[i].variant.toLowerCase();
                   pokemon["image"] = await imageInfo(`${lowerCaseName}-${lowerCaseVariant}`)
                } else {
                    const lowerCaseName = usersPokePlain.pokemons[i].name.toLowerCase();
                    pokemon["image"] = await imageInfo(`${lowerCaseName}`)
                }
                
                collection.push(pokemon);
                 
            }
        }
        
        res.render('mypokollection', { collection, loggedIn: req.session.loggedIn, email: req.session.email });

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
    
});

router.get('/recommendations', withAuth, async (req, res) => {
    const pokemonModels = await Pokemon.findAll({
        order: [['pokedex_id', 'ASC'], ['variant', 'ASC']]
    });
    const pokemon = pokemonModels.map(pkModel => pkModel.get({plain: true}));

    res.render('recommendations', { loggedIn: req.session.loggedIn, pokemon, email: req.session.email })
});

router.get('/add', withAuth, async (req, res) => {
    try {
        // get all pokemon and include user data when it matches
        // the user logged in, then filter out when user data is
        // defined.
        // TODO: refactor to do filtering in SQL query
        const pokemonData = await Pokemon.findAll({
            include: [{
                model: UsersPokemon,
                where: {
                    user_id: req.session.userId
                },
                required: false
            }],
            order: [['pokedex_id', 'ASC'], ['variant', 'ASC']]
        });
        // const pokemonData = await sequelize.query(
        //     `select * from pokemon
        //     left join users_pokemon
        //         on pokemon.id = users_pokemon.pokemon_id
        //     where user_id NOT IN (${req.session.userId}) OR user_ID IS NULL;
        //     `,
        //     {
        //         model: Pokemon,
        //         mapToModel: true
        //     }
        // );
        const pokemon = pokemonData.map(pkModel => pkModel.get({plain: true}))
                                   .filter(pkModel => pkModel.users_pokemons.length == 0 );
        
        res.render('add', { loggedIn: req.session.loggedIn, pokemon, email: req.session.email });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/login', async (req, res) => {
    res.render('login', {});
});

module.exports = router;

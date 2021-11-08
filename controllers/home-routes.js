const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Pokemon, UsersPokemon } = require('../models');
// const sequelize = require('../config/connection');
const {Op} = require('sequelize');
const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();

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

            //get pics for each pokemon
            const getPics = async (recResults) => {

                if(recResults.length < 1) {
                    return [];
                }
            
                //create array of pokemon to fetch
                const pokemon = recResults.map(pokemon => {
                    if(pokemon.variant) {
                        //if pokemon is a variant, concatenate name with variant for pokeAPI
                        return `${pokemon.name.toLowerCase()}-${pokemon.variant.toLowerCase()}`;
                    } else {
                        return pokemon.name.toLowerCase();
                    }
                });
            
                //fetch data from PokeAPI
                const pokeData = await P.getPokemonByName(pokemon);
            
                const pics = pokeData.map((pokemon) => {
                    
                    return {
                        name: pokemon.species.name[0].toUpperCase() + pokemon.species.name.substring(1),
                        spriteUrl: pokemon.sprites.front_default,
                        variant: (pokemon.name.includes('alola') || pokemon.name.includes('galar')) ? pokemon.name.substring(pokemon.name.length - 5) : null
                    }
            
                });
            
                //console.log(recResults);
            
                //add pic to each enemy pokemon
                recResults.forEach((el, i) => {
                    el.imageURL = pics[i].spriteUrl;
                });
            
                //console.log(pics);
            
                return recResults;
            }

            await getPics(collection);
        }

        // console.log(collection);

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

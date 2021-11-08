const router = require('express').Router();

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
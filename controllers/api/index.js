const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const collectionRoutes = require('./collection-routes.js');

router.use('/users', userRoutes);
router.use('/collection', collectionRoutes);

module.exports = router;
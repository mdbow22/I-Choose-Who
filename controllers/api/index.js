const router = require('express').Router();

const userRoutes = require('./user-routes');
const recRoutes = require('./rec_routes');
const collectionRoutes = require('./collection-routes.js');

router.use('/users', userRoutes);
router.use('/recs', recRoutes);
router.use('/collection', collectionRoutes);

module.exports = router;
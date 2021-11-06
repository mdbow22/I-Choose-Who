const router = require('express').Router();

const userRoutes = require('./user-routes');
const recRoutes = require('./rec_routes');

router.use('/users', userRoutes);
router.use('/recs', recRoutes);

module.exports = router;
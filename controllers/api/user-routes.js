const router = require('express').Router();
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    res.send('Hello users')
})

module.exports = router;
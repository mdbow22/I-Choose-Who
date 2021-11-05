const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// Create new user/sign up
router.post('/', async (req, res) => {

    const hashedPw = await bcrypt.hash(req.body.password, 10)

    try {
        const newUser = await User.create({
            email: req.body.email,
            password: hashedPw,
        });

        req.session.save(() => {
            req.session.loggedIn = true;
            res.status(200).json(newUser);
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Existing user/log in
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
            return;
        }

        req.session.userId = user.id;
        req.session.loggedIn = true;

        req.session.save(() => {
            res.status(200).json({ message: 'You are now logged in!' });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
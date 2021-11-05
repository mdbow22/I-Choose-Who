const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const helpers = require('./utils/helpers');
// const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// const sess = {
//     secret: 'secret secret',
//     cookie: {},
//     resave: false,
//     saveUninitialized: true,
//     store: new SequelizeStore({
//       db: sequelize,
//     }),
//   };

// app.use(session(sess));

// const hbs = exphbs.create({
//     extname: '.hbs',
//     defaultLayout: 'default',
//     layoutsDir: './views/layouts',
//     partialsDir: './views/partials'
// });

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => console.log('Now listening'));
// });

app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}`)
);
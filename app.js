const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');


const Routeruser = require('./routes/userRoutes');
const swaggerSetup = require('./Swagger');

// Importar sequelize para sincronizar la base de datos durante el arranque
const { sequelize } = require('./models/database');

const bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);

app.use(Routeruser);
swaggerSetup(app);

// Sincronizar la base de datos al arrancar la app (control centralizado)
sequelize.sync()
	.then(() => console.log('Database synchronized'))
	.catch(err => console.error('Unable to sync database:', err));

module.exports = app;

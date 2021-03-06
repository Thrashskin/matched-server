require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
//const hbs = require('hbs');

require('./configs/passport');

mongoose
  .connect(process.env.MONGODB_URI, { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
   })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

// const app_name = require('./package.json').name;
// const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    }
  })
);

app.set("trust proxy", 1);

app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Matched - Go right and land your dream job!';


app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_POINT,
}));


//ROUTES MIDDLEWARE

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
//const { MongoStore } = require('connect-mongo');
app.use('/api', authRoutes);

const companyRoutes = require('./routes/company-routes');
app.use('/api', companyRoutes);

const seekerRoutes = require('./routes/seeker-routes');
app.use('/api', seekerRoutes);

const offerRoutes = require('./routes/offer-routes');
app.use('/api', offerRoutes);

const chatRoutes = require('./routes/chat-routes');
app.use('/api', chatRoutes);

module.exports = app;
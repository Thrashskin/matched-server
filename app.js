require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

require('./configs/passport');

mongoose
  .connect('mongodb://localhost/matched-server', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
}
);

const port = process.env.PORT
const Message = require('./models/Message');
const Chat = require('./models/Chat');



// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//SOCKET SETTINGS




io.on('connection', (socket) => {

  console.log('SOCKET', socket)

  // Get the last 10 messages from the database.
  Message.find().sort({ createdAt: -1 }).limit(10).exec((err, messages) => {
    if (err) return console.error(err);

    // Send the last messages to the user.
    socket.emit('init', messages);
  });

  // Listen to connected users for a new message.
  socket.on('message', (msg) => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      sender: msg.sender
    });

    // Save the message to the database.
    message.save((err) => {

      if (err) {
        return console.error(err);
      }

      // Chat.findByIdAndUpdate(chatID, {
      //   $push:  {messages: message}
      // })
      // .then(response => console.log(response))
      // .catch(error => console.log(error));

    });

    // Notify all other users about a new message.
    socket.broadcast.emit('push', msg);
  });
});

// http.listen(port, () => {
//   console.log('listening on *:' + port);
// });



//SESSION SETTINGS  
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Matched - Go right and land your dream job!';


app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

app.use(function (req, res, next) {
  res.io = io;
  next();
});


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

module.exports = { app: app, server: server };
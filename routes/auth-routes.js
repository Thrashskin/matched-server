const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

var {User} = require('../models/User');
var Seeker = require('../models/Seeker');
var Company = require('../models/Company');


//SIGNUP

//WARNING: we haven't defined the GET route for signup YET.

authRoutes.post('/signup', (req, res, next) => {
  
  const {email, password, kind} = req.body; //bodyparser allowed in app.js
  const emailReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  const passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  var newUser = {}

  if (!email || !password) {
    res.status(400).json({ message: 'Please, provide all the required fields.' });
    return;
  }

  if (!emailReg.test(email)) {
    res.status(400).json( {message: 'Please enter a valid email'} )
    return;
  }
  
  if (!passwordReg.test(password)) {
    res.status(400).json( {message: 'Password must have one lowercase, one uppercase, a number, a special character and must be at least 8 digits long'} )
    return;
  }

  
  // }); //findOne-email
  User.findOne({email})
  .then(foundUser => {

    if(foundUser) {
      res.status(400).json({ message: "This email address is already registered" });
      //TO DO: REDIRECT TO LOGIN
      return;
    }

    if (kind === 'Company') {
      newUser = new Company({
        email: email,
        password: hashedPassword
      });
    } else {
      newUser = new Seeker({
        email: email,
        password: hashedPassword
      });
    }

    newUser.save(error => {
      
      if(error) {
        res.status(400).json({ message: 'Error while saving new user to database' });
        return; 
      }

      req.login(newUser, error => {

        if (error) {
          res.status(500).json({message: 'Error while login after signup'})
          return;
        }

        res.status(200).json({newUser});
        //return;
      });
    })
  })
  .catch(error => {
    res.status(400).json({ message: "Error" })
  });

}) //authRoutes

authRoutes.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, theUser, failureDetails) => {

    if (err) {
      return next(err);
    }
 
    if (!theUser) {
      // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      console.log(failureDetails)
      res.status(400).json( { errorMessage: 'Wrong password or email' } );
      return;
    }
 
    // save user in session: req.user
    req.login(theUser, err => {
      if (err) {
        return next(err);
      }
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

authRoutes.get('/logout', (req, res) => {

  console.log(req)
  req.logout();
  res.status(200).json({ message: 'Logged out' })
})

authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

module.exports = authRoutes;
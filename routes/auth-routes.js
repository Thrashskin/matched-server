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

  if (!email || !password) {
    res.status(400).json({ message: 'Please, provide all the required fields.' });
    return;
  }

  const emailReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  if (!emailReg.test(email)) {
    res.status(400).json( {message: 'Please enter a valid email'} )
    return;
  }

  const passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
  if (!passwordReg.test(password)) {
    res.status(400).json( {message: 'Password must have one lowercase, one uppercase, a number, a special character and must be at least 8 digits long'} )
    return;
  }

  User.findOne( {email}, (error, foundUser) => {

    if(error) {
      res.status(500).json( {message: "Something went wrong"} );
      return;
    }

    if(foundUser) {
      res.status(400).json({ message: "This email address is already registered" });
      console.log('duplicated email')
      //TO DO: REDIRECT TO LOGIN
      return;
    }

  }); //findOne-email

  // if (kind === 'Company') {

  //   User.findOne( {name}, (error, foundCompany) => {

  //     if(error) {
  //       res.status(500).json( {message: "Something went wrong"} );
  //       return;
  //     }
  
  //     if(foundCompany) {
  //       res.status(400).json({ message: "This company is already registered in our database" });
  //       console.log('duplicated email')
  //       //TO DO: REDIRECT TO LOGIN
  //       return;
  //     }
  
  //   }); //findOne
  // }


  const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    var newUser = {}

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

        res.status(200).json(newUser);

        });

    })

}) //authRoutes

//LOGIN
// authRoutes.get('/login', (req, res, next) => {
//   console.log('login route')
// })

authRoutes.post('/login', (req, res, next) => {

  console.log(req.body)

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
  req.logout();
  res.status(200).json({ message: 'Logged out' })
})


module.exports = authRoutes;






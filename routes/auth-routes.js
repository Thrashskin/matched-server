const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const Seeker = require('../models/Seeker');
const Company = require('../models/Company');

authRoutes.post('/signup', (req, res, next) => {

  console.log(req)
  
  const {email, password, kind} = req.body; //bodyparser allowed in app.js

  if (!email || !password) {
    res.status(400).json({ message: 'BOTH email and password are MANDATORY' });
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

    //let User = '' //it's uppercase because it will store a model.

    if(error) {
      res.status(500).json( {message: "Something went wrong"} );
      return;
    }

    if(foundUser) {
      res.status(400).json({ message: "This email address is already registered" }).
      //TO DO: REDIRECT TO LOGIN
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // User = kind === 'Company' ? Company : Seeker;

    // const newUser = new User({
    //   email: email,
    //   password: hashedPassword
    // });

    const newUser = {}

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

      // req.login(newUser, error => {

      //   if (error) {
      //     res.status(500).json({message: 'Error while login after signup'})
      //     return;
      //   }

      //   res.status(200).json(newUser);

      //   });

    })

  }); //findOne

}) //authRoutes

module.exports = authRoutes;






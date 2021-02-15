const {User}          = require('../models/User');
const Seeker        = require('../models/Seeker');
const Company        = require('../models/Company');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs');
const passport      = require('passport');
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

// passport.deserializeUser((userIdFromSession, cb) => {
//   Seeker.findById(userIdFromSession)
//   .then(seekerFromDB => {
//     if (seekerFromDB) {
//       cb(null, seekerFromDB)
//     } else {
//       //If we are here the user should be a company.
//       Company.findById(userIdFromSession)
//       .then(companyFromDB => cb(null, companyFromDB))
//       .catch(error => cb(error))
//     }
//   })
//   .catch(error => cb(error))
// })

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
  .then(userFromDB => cb(null, userFromDB))
  .catch(error => cb(error))
});

// passport.use(
//   new LocalStrategy(

//     {
//       usernameField: 'email', // by default
//       passwordField: 'password', // by default
//       passReqToCallBack: true
//     },
//     (username, password, done) => {
      
//       Seeker.findOne({ email: username })
//       .then(seekerFromDB => {

//         if (seekerFromDB) {
//           //If we are here it means it's a Seeker
//           if (!bcrypt.compareSync(password, seekerFromDB.password)) {
//             return done(null, false, { message: 'Incorrect username or password' });
//           }
//           //If we are here it means that the password is correct
//           done(null, seekerFromDB);
        
//         } else { 
//           //If we are here it means that it's either a Company
//           //or the email is not in the database
//           Company.findOne( {email: username} )
//           .then(companyFromDB => {

//             if (!companyFromDB) {
//               return done(null, false, { message: 'Incorrect username or password' });
//             }
//             if (!bcrypt.compareSync(password, companyFromDB.password)) {
//                 return done(null, false, { message: 'Incorrect username or password' });
//             }

//             done(null, companyFromDB);
//           })
//           .catch(error => done(error))
//         }
//       })
//       .catch(error => done(error))
//     }
//   )
// );


passport.use(
  new LocalStrategy(

    {
      usernameField: 'email', // by default
      passwordField: 'password', // by default
      passReqToCallBack: true
    },
    (username, password, done) => {
      
      User.findOne({ email: username })
      .then(userFromDB => {

        if (!userFromDB) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        if (!bcrypt.compareSync(password, userFromDB.password)) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        done(null, userFromDB);
      })
      .catch(error => done(error))
    }
  )
);
const User          = require('../models/User');
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
//   User.findById(userIdFromSession, (err, userDocument) => {
//     if (err) {
//       cb(err);
//       return;
//     }
//     cb(null, userDocument);
//   });
// });

passport.deserializeUser((userIdFromSession, cb) => {
  console.log(userIdFromSession);
  Seeker.findById(userIdFromSession)
    .then(userDocument => cb(null, userDocument))
    .catch(err => cb(err));
});

passport.use(
  new LocalStrategy(

    {
      usernameField: 'email', // by default
      passwordField: 'password', // by default
      passReqToCallBack: true
    },
    (username, password, done) => {
      
      // Seeker.findOne({ email: username })
      //   .then(userFromDb => {
      //     console.log(userFromDb)
      //     if (!userFromDb) {
      //       return done(null, false, { message: 'Incorrect username or password' });
      //     }
 
          // if (!bcrypt.compareSync(password, userFromDb.password)) {
          //   return done(null, false, { message: 'Incorrect username or password' });
          // }
 
      //     done(null, userFromDb);
      //   })
      //   .catch(err => done(err));

      Seeker.findOne({ email: username })
      .then(seekerFromDB => {

        if (seekerFromDB) {
          //If we are here it means it's a Seeker
          if (!bcrypt.compareSync(password, seekerFromDB.password)) {
            return done(null, false, { message: 'Incorrect username or password' });
          }
          //If we are here it means that the password is correct
          done(null, seekerFromDB);
        
        } else { 
          //If we are here it means that it's either a Company
          //or the email is not in the database
          Company.findOne( {email: username} )
          .then(companyFromDB => {

            if (!companyFromDB) {
              return done(null, false, { message: 'Incorrect username or password' });
            }
            if (!bcrypt.compareSync(password, companyFromDB.password)) {
                return done(null, false, { message: 'Incorrect username or password' });
            }

            done(null, companyFromDB);
          })
          .catch(error => done(error))
        }
      })
      .catch(error => done(error))
    }
  )
);



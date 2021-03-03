const express = require('express');
const Company = require('../models/Company');
const Seeker = require('../models/Seeker');
const offerRoutes = express.Router();
const Offer = require('../models/Offer');
const mongoose = require('mongoose');
const { User } = require('../models/User');

//GET offer details
offerRoutes.get('/offer/:offerID', (req, res, next) => {
  const { offerID } = req.params

  Offer.findById(offerID).
    then(offerFromDB => {
      res.status(200).json(offerFromDB);
    })
    .catch(error => res.json(error));
});

//GET ALL offers 

offerRoutes.get('/offers/all', (req, res, next) => {
  Offer.find().populate('publisher')
    .then(offersFromDB => res.status(200).json(offersFromDB))
    .catch(error => res.status(400).json(error));

});

//GET all offers for ONE company
offerRoutes.get('/:companyID/offers', (req, res, next) => {

  let companyID = req.params.companyID

  Offer.find({ publisher: companyID })
    .then(offersFromDB => res.status(200).json(offersFromDB))
    .catch(error => res.status(400).json(error));

})

//GET applied offers
offerRoutes.get('/:seekerID/applications', (req, res, next) => {

  let seekerID = req.params.seekerID

  // Offer.find({ publisher: companyID })
  //   .then(offersFromDB => res.status(200).json(offersFromDB))
  //   .catch(error => res.status(400).json(error));

  Seeker.findById(seekerID)
    .populate('offers')
    .then(userFromDB => {
      console.log(userFromDB.offers)
      res.status(200).json(userFromDB.offers)
    })
    .catch(error => res.status(400).json(error));




})

//GET saved offers
offerRoutes.get('/:seekerID/saved', (req, res, next) => {

  let seekerID = req.params.seekerID

  Seeker.findById(seekerID)
    .populate('saved')
    .then(userFromDB => res.status(200).json(userFromDB.saved))
    .catch(error => res.status(400).json(error));

})

//POST new offer

offerRoutes.post('/offer', (req, res, next) => {

  var publisher = req.session.passport.user;
  var newOffer = new Offer({ publisher, ...req.body })

  Offer.create(newOffer)
    .then(createdOffer => {
      console.log('new offer id: ', createdOffer._id)
      console.log('publisher: ', createdOffer.publisher)
      return Company.findByIdAndUpdate(createdOffer.publisher, {
        $push: { offers: createdOffer._id }
      })
        .then(response => res.json(response))
        .catch(error => res.status(409).json(error)); //catch-companyFindByIdAndUpdate
    })
    .catch(error => {
      console.log(error)
      res.status(408).json(error)
    });//catch-Offer.create



});//offerRoutes.post

//PUT edit offer

offerRoutes.put('/offer/:offerID', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.offerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Offer.findByIdAndUpdate(req.params.offerID, req.body)
    .then(() => {
      res.json({ message: `Offer ${req.params.offerID} updated` });
    })
    .catch(error => res.json(error))
});

//DELETE offer

offerRoutes.delete('/offer/:offerID', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.offerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  let { user } = req.session.passport;
  let { offerID } = req.params



  // Offer.findByIdAndRemove(req.params.offerID)
  // .then(() => {
  //   res.json({ message: `Offer ${req.params.id} deleted.` });
  // })
  // .catch(error => {
  //   res.json(error);
  // });


  Offer.findByIdAndRemove(offerID)
    .then(() => {

      User.findByIdAndUpdate(user, {
        $pull: { offers: offerID }
      })
        .then(response => console.log(response))
        .catch(error => console.log(error))

      res.json({ message: `Offer ${req.params.id} deleted.` });

    })
    .catch(error => {
      res.json(error);
    });


  //res.json({ message: `Offer ${req.params.id} deleted.` });

});

//PUT apply to offer

offerRoutes.put('/offer/:offerID/apply', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.offerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  var applicant = req.session.passport.user;
  var { offerID } = req.params;

  //Check that the User is a Seeker

  User.findById(applicant)
    .then(userFromDB => {
      if (userFromDB.offers.includes(offerID)) {
        res.status(405).json({ message: 'User is already in the list of candidates for this offer' });
        return;
      }
      //Push the offerID into the appliedOffers array of the Seeker
      User.findByIdAndUpdate(applicant, {
        $push: { offers: offerID }
      })
        .then(response => {
          Seeker.findByIdAndUpdate(applicant, { //We use Seeker instead of User so we can $push and $pull in the same operation.
            $pull: { saved: offerID }
          })
            .then(response => {
              Offer.findByIdAndUpdate(offerID, {
                $push: { candidates: applicant }
              })
                .then(() => console.log('Succesfully applied to offer'))
                .catch(error => res.json(error))
            })
            .catch(error => res.json(error))
          res.status(200).json(response)
        })
        .catch(theError => res.json(theError))
    })
    .catch(error => res.json(error));

  // User.findById(applicant)
  //   .then(userFromDB => {
  //     if (userFromDB.offers.includes(offerID)) {
  //       res.status(405).json({ message: 'User is already in the list of candidates for this offer' });
  //       return;
  //     }
  //     //Push the offerID into the appliedOffers array of the Seeker
  //     User.findByIdAndUpdate(applicant, {
  //       $push: { offers: offerID }
  //     })
  //       .then(response => {
  //         Offer.findByIdAndUpdate(offerID, {
  //           $push: { candidates: applicant }
  //         })
  //           .then(() => console.log('Succesfully applied to offer'))
  //           .catch(error => res.json(error))
  //         res.status(200).json(response)
  //       })
  //       .catch(theError => res.json(theError))
  //   })
  //   .catch(error => res.json(error));
});

//SAVE OFFER

offerRoutes.put('/offer/:offerID/save', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.offerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  var userID = req.session.passport.user;
  var { offerID } = req.params

  User.findById(userID)
    .then(userFromDB => {

      if (userFromDB.saved.includes(offerID)) {
        res.status(406).json({ message: 'You already saved this offer' });
        return;
      }

      Seeker.findByIdAndUpdate(userID, {
        $push: { saved: offerID }
      })
        .then(response => res.status(200).json(response)) //findAndUpdate
        .catch(error => res.status(400).json(error));//findAndUpdate
    }) // findById
    .catch(error => res.status(400).json(error)) // findById

});

//REJECT OFFER

offerRoutes.put('/offer/:offerID/reject', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.offerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  var userID = req.session.passport.user;
  var { offerID } = req.params

  User.findById(userID)
    .then(userFromDB => {

      if (userFromDB.saved.includes(offerID)) {
        res.status(406).json({ message: 'This offer has already been rejected' });
        return;
      }

      Seeker.findByIdAndUpdate(userID, {
        $push: { rejected: offerID }
      })
        .then(response => res.status(200).json(response)) //findAndUpdate
        .catch(error => res.status(400).json(error));//findAndUpdate
    }) // findById
    .catch(error => res.status(400).json(error)) // findById

});


module.exports = offerRoutes;
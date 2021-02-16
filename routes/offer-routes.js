const express = require('express');
const Company = require('../models/Company');
const offerRoutes = express.Router();
const Offer = require('../models/Offer');
const mongoose = require('mongoose');

//GET offer details
offerRoutes.get('/offer/:offerID', (req, res, next) => {
  const {offerID} = req.params

  Offer.findById(offerID).
  then(offerFromDB => {
    res.status(200).json(offerFromDB);
  })
  .catch(error => res.json(error));
});

//POST new offer

offerRoutes.post('/offer', (req, res, next) => {

  var publisher = req.session.passport.user;
  var newOffer = new Offer({publisher,...req.body})

  console.log(newOffer)

  Offer.create(newOffer)
  .then(createdOffer => {
    console.log('new offer id: ', createdOffer._id)
    console.log('publisher: ', createdOffer.publisher)
    return Company.findByIdAndUpdate(createdOffer.publisher, {
      $push: { offers: createdOffer._id }
    })
    .then(response => res.json(response))
    .catch(error => res.json(error)); //catch-companyFindByIdAndUpdate
  })
  .catch(error => res.json(error));//catch-Offer.create



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

offerRoutes.delete('/offer/:offerID', (req, res, next) => {
  
  if (!mongoose.Types.ObjectId.isValid(req.params.offerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Offer.findByIdAndRemove(req.params.offerID)
  .then(() => {
    res.json({ message: `Offer ${req.params.id} deleted.` });
  })
  .catch(error => {
    res.json(error);
  });

});


module.exports = offerRoutes;
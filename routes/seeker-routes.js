const express = require('express');
const Seeker = require('../models/Seeker');
const seekerRoutes = express.Router();
const mongoose = require('mongoose');

//GET seeker details
seekerRoutes.get('/seeker/:seekerID', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.seekerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Seeker.findById(req.params.seekerID)
  .then(seekerFromDB => {
    res.status(200).json(seekerFromDB);
  })
  .catch(error => res.json(error))
});

seekerRoutes.get('/seeker/:seekerID/edit', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.seekerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Seeker.findById(req.params.seekerID)
  .then(seekerFromDB => {
    res.status(200).json(seekerFromDB);
  })
  .catch(error => res.json(error))
});

//EDIT seeker details

seekerRoutes.put('/seeker/:seekerID', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.seekerID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Seeker.findByIdAndUpdate(req.params.seekerID, req.body)
  .then(() => {
    res.json({ message: `seeker ${req.params.seekerID} updated` });
  })
  .catch(error => res.json(error))
});

module.exports = seekerRoutes;
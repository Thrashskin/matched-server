const express = require('express');
const Company = require('../models/Company');
const companyRoutes = express.Router();
const mongoose = require('mongoose');

//GET company details
companyRoutes.get('/company/:companyID', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.companyID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Company.findById(req.params.companyID)
  .then(companyFromDB => {
    res.status(200).json(companyFromDB);
  })
  .catch(error => res.json(error))
});

companyRoutes.get('/company/:companyID/edit', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.companyID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Company.findById(req.params.companyID)
  .then(companyFromDB => {
    res.status(200).json(companyFromDB);
  })
  .catch(error => res.json(error))
});

//EDIT company details

companyRoutes.put('/company/:companyID', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.companyID)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Company.findByIdAndUpdate(req.params.companyID, req.body)
  .then(() => {
    res.json({ message: `Company ${req.params.companyID} updated` });
  })
  .catch(error => res.json(error))
});

module.exports = companyRoutes;
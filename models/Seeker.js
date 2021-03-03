const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {User, options} = require('./User');

const seekerSchema = new Schema({
  lastName: String,
  linkedIn: String,
  gitHub: String,
  resumes: [String],
  previousJobs:[{
    role: String,
    initDate: Date,
    endDate: Date,
    stack: [String]
  }],
  stack: [String],
  saved: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' } ],
  rejected: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' } ],
}, options);

const Seeker = User.discriminator('Seeker', seekerSchema);

module.exports = Seeker;
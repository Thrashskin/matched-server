const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: String,
  country: String,
  stack: [String],
  salary: {
    from: { type: Number, required: true },
    to: { type: Number, required: true }
  },
  currency: {
    type: String
  },
  requiredExperience: {type: Number, default: 0},
  publisher: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
  candidates: [{
    type: Schema.Types.ObjectId, 
    ref: 'Seeker'
  }]
})

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
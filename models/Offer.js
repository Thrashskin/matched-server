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
  stack: [String],
  salary: {
    from: { type: Number, required: true },
    to: { type: Number, required: true }
  }
})

const Offer = mongoose.model('Offer', offerSchema);
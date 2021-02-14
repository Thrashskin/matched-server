const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' }

// kind: {
//   type: String,
//   required: true,
//   enum: ['Seeker', 'Company']
// },

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  city: String,
  country: String,
  image: String,
  offers: [ { type: Schema.Types.ObjectId, ref: 'Offer' } ],
  options
})

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  options
}
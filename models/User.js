const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { 
  discriminatorKey: 'kind',

 }

//  kind: {
//   type: String,
//   required: true,
//   enum: ['Seeker', 'Company']
// },

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salaryExpectations: {
    from: { type: Number},
    to: { type: Number}
  },
  name: String,
  city: String,
  country: String,
  image: String,
  offers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Offer',
   }],
}, options);

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  options
}
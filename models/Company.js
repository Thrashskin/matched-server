const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {User, options} = require('./User');

const companySchema = new Schema({
  foundationYear: String,
  description: String,
  options
})

const Company = User.discriminator('Company', companySchema);

module.exports = Company;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  company: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  seeker: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
});

const Chat = mongoose.model('Chat');

module.exports = Chat;
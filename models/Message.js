const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: String,
  senderName: String,
  senderID: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
}, {
  timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
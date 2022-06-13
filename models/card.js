const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlentgh: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: undefined,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('card', cardSchema);

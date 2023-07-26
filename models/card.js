const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const { URL_REGEX } = require('../utils/constants');

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Card name must be between 2 and 30 characters long',
      },
    },

    link: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'URL required',
      },
    },

    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },

    likes: [
      {
        type: ObjectId,
        ref: 'user',
        default: [],
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);

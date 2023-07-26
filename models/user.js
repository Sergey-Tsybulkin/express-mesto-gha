const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const { URL_REGEX } = require('../utils/constants');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Required to enter an email address',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 6,
        message: 'Password must be at least 6 characters long',
      },
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Username must be between 2 and 30 characters long',
      },
    },
    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message:
          'User information must be between 2 and 30 characters long',
      },
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'URL required',
      },
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;
                return Promise.reject();
              });
            }
            return Promise.reject();
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);

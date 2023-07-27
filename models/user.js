const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const { REGEX } = require('../utils/constants');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Необходимо ввести электронный адрес',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 6,
        message: 'Длина пароля должна состоять из 6 символов минимум',
      },
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
    },
    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message:
          'Информация о пользователе должна быть длиной от 2 до 30 символов',
      },
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => REGEX.test(url),
        message: 'Необходим URL',
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

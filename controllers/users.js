const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
  };

  module.exports.getUserId = (req, res, next) => {
    const { id } = req.params;

    User
      .findById(id)
      .then((user) => {
        if (user) return res.send({ user });
        throw new NotFoundError('Пользователь c указанным _id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
  };
  module.exports.getCurrentUserInfo = (req, res, next) => {
    const { userId } = req.user;

    User
      .findById(userId)
      .then((user) => {
        if (user) return res.send({ user });
        throw new NotFoundError('Пользователь c указанным _id не найден');
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError('Переданы некорректные данные при поиске пользователя'));
        } else {
          next(err);
        }
      });
    };
    module.exports.updateUserProfile = (req, res, next) => {
      const { name, about } = req.body;
      const { userId } = req.user;

      User
      .findByIdAndUpdate(
        userId,
        {
          name,
          about,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .then((user) => {
        if (user) return res.send({ user });
        throw new NotFoundError('Пользователь c указанным _id не найден');
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          next(
            new BadRequestError(
              'Переданы некорректные данные при обновлении профиля',
            ),
          );
        } else {
          next(err);
        }
      });
    };
    module.exports.updateUserAvatar = (req, res, next) => {
      const { avatar } = req.body;
      const { userId } = req.user;

      User
        .findByIdAndUpdate(
          userId,
          {
            avatar,
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .then((user) => {
          if (user) return res.send({ user });
          throw new NotFoundError('Пользователь c указанным _id не найден');
        })
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            next(
              new BadRequestError(
                'Переданы некорректные данные при обновлении профиля пользователя',
              ),
            );
          } else {
            next(err);
          }
        });
      };




const { SECRET_SIGNING_KEY } = require('../utils/constants');

const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');

function registrationUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(
            'User with this email address is already registered',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Incorrect data sent during user registration',
          ),
        );
      } else {
        next(err);
      }
    });
};

function loginUser(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, SECRET_SIGNING_KEY, {
          expiresIn: '7d',
        });
        return res.send({ _id: token });
      }
      throw new UnauthorizedError('Wrong email or password');
    })
    .catch(next);
};

function getUsers(_, res, next) {
  User
    .find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

function getUserId(req, res, next) {
  const { id } = req.params;
  User
    .findById(id)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('User with this id was not found');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid id passed'));
      } else {
        next(err);
      }
    });
};

function getCurrentUserInfo(req, res, next) {
  const { userId } = req.user;
  User
    .findById(userId)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('User with this id was not found');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid id passed'));
      } else {
        next(err);
      }
    });
};

function editProfileUserInfo(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;
  User
    .findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('User with this id was not found');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Invalid data passed when updating profile',
          ),
        );
      } else {
        next(err);
      }
    });
};

function updateProfileUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;
  User
    .findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('User with this id was not found');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Incorrect data passed when updating user profile',
          ),
        );
      } else {
        next(err);
      }
    });
}
module.exports = {
  registrationUser,
  loginUser,
  getUsers,
  getUserId,
  getCurrentUserInfo,
  editProfileUserInfo,
  updateProfileUserAvatar,
};

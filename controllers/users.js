const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Default error' }));
};

module.exports.getUserId = (req, res) => {
  User

    .findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({
            message: "User with this ID can't be found",
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(404)
          .send({
            message: 'Posting wrong data card when finding user',
          });
      }
      return res.status(500).send({ message: 'Default error' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Posting wrong data card when creating user',
        });
      } else {
        res.status(500).send({ message: 'Default error' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Posting wrong data card when updating profile',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(404)
          .send({
            message: 'Пользователь не найден',
          });
      }
      return res.status(500).send({ message: 'Default error' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Posting wrong data card when updating avatar',
          });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(404)
          .send({
            message: 'Пользователь не найден',
          });
      }
      return res.status(500).send({ message: 'Default error' });
    });
};

const jwt = require('jsonwebtoken');
const { SECRET_SIGNING_KEY } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const error = 'Wrong email or password';

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError(`${error}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_SIGNING_KEY);
  } catch (err) {
    return next(new UnauthorizedError(`${error}!`));
  }

  req.user = payload;
  return next();
};

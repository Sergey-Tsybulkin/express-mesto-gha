const jwt = require('jsonwebtoken');

const someSecretKey = '$2b$10$GWl4u9KstqG57OdgUooKUO1o9hkH9lvXFMOAqpF04j.Pg9H5M9DRS';
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMsg = 'Wrong email or password';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError(`${errorMsg}(${authorization})!`));
  }
  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, someSecretKey);
  } catch (err) {
    return next(new UnauthorizedError(`${errorMsg}!`));
  }
  req.user = payload;
  return next();
};

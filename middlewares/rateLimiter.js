const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 150,
  windowMS: 55000,
  message: 'The number of requests to the server has exceeded the limit. Please try again later',
});

module.exports = limiter;

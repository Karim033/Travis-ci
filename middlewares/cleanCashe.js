const { clearHash } = require("../services/cashe.js");

module.exports = async (req, res, next) => {
  await next();
  clearHash(req.user.id);
};

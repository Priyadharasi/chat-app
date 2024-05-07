const jwt = require('jsonwebtoken');
/**
 * Method used to generate json web token.
 */
const getJWT = async function (jwt_encryption, jwt_payload) {
  return "Bearer " + jwt.sign(jwt_payload, jwt_encryption, { expiresIn: CONFIG.jwt_expiration });
};
module.exports.getJWT = getJWT;
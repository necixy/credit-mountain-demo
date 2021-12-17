const jwt = require('jsonwebtoken');
const db = require('utils/db')
require('dotenv');

module.exports = authorize;

function authorize() {

  return async (req, res, next) => {
    const access_token = req.headers.authorization.slice(7);
    const payload = jwt.decode(access_token);
    const user = await db.Parent.findById(payload.sub).exec();
    const date = new Date().getTime();
    if(user && jwt.verify(access_token, process.env.JWT_SECRET) && date > payload.iat + 10080 * 1000 * 1000){
      req.user = user;
      next();
    } 
    else{
      throw 'Token expired or invalid! Please, login again.';
    }
  }
}

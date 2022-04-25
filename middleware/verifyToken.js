var {SUCCESS,FAIL,secret}=require('../config')
var jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
  return next();

  // console.log(req.headers)
  let token=req.headers['x-access-token']
  // console.log('token',token)
  try {
    let id=jwt.verify(token, secret);
    console.log('id',id)
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
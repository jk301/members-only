// lib/utils.js

// const crypto = require('crypto');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

require('dotenv').config()

// using this as a template (will make changes accordingly)

// function validPassword(password, hash, salt) {
//     var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
//     return hash === hashVerify;
// }


// function genPassword(password) {
//     var salt = crypto.randomBytes(32).toString('hex');
//     var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
//     return {
//       salt: salt,
//       hash: genHash
//     };
// }

// bcrypt 

async function passValid (password, hashed) {
  const result = await bcrypt.compare(password, hashed)
  return result
}

async function passGen (password) {
  const hashed = await bcrypt.hash(password, 15)
  return hashed
}

// async function runner () {
//   const firstHash = await bcryptGen(123)
//   const result = await bcryptValid(123, firstHash)
//   console.log(result)
//   return
// }
// runner()



// JWT issuance (not done yet) 

const PRIV_KEY = process.env.PRV_KEY

function issueJWT(user) {
  const id = user.id;

  const expiresIn = '1d';

  const payload = {
    sub: id
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: signedToken,
    expires: expiresIn
  }
}

module.exports.passValid = passValid;
module.exports.passGen = passGen;
module.exports.issueJWT = issueJWT;
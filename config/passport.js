// config/passport.js

// Need to figure out what is needed

const fs = require('fs');
const { ExtractJwt, Strategy } = require('passport-jwt');
const path = require('path');
const db = require('../db/queries')

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// const passportJWTOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: PUB_KEY || "secret phrase",
//     issuer: "issue here ???", 
//     audience: "enter audience here",
//     algorithms: ['RS256'],
//     ignoreExpiration: false,
//     passReqToCallback: false,
//     jsonWebTokenOptions: {
//         complete: false,
//         clockTolerance: '',
//         maxAge: '2d',
//         clockTimestamp: '100',
//         nonce: "string here for openID"
//     }
// }

function extractToken (req, res) {
    const cookie = req.cookies

    if (cookie) {
        return cookie.token
    } else {
        return null
    }
}


const options = {
    jwtFromRequest: extractToken,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

const strategy = new Strategy(options, async (payload, done) => {
    try {
        const user = await db.findById(payload.sub)
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (err) {
        done(err, null)
    }

})

// TODO
module.exports = (passport) => {
    passport.use(strategy)
}
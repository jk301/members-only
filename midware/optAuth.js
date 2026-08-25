// midware/optAuth.js

const jsonwebtoken = require('jsonwebtoken')
const db = require('../db/queries')
const path = require('path')
const fs = require('fs')

const PUB_KEY = process.env.PUB_KEY

async function optAuthCheck (req, res, next) {
    const exist = req.cookies.token

    if (exist) {
        const jwt = jsonwebtoken.verify(exist, PUB_KEY, { algorithms: ['RS256'] }, async (err, payload) => {
            if (err) return next()

            try {
                const user = await db.findById(payload.sub)
                req.user = user
                next()
            } catch (error) {
                console.log(error)
                next()
            }
            
        })

    } else {
        next()
    }
}

module.exports = {
    optAuthCheck
}
// controllers/indexController.js

const db = require('../db/queries')
const utils = require('../lib/utils')

require('dotenv').config()

// REMEMBER TO REMOVE CONSOLE LOGS

function getMainPage (req, res) {
    const exist = req.user

    if (exist) {
        res.render('index', { logged: true, user: exist })
    } else {
        res.render('index', { logged: false, user: null })
    }
    
}

function getRegister (req, res) {
    res.render('register')
}

function getLogin (req, res) {
    res.render('login')
}

function getMemberCheck (req, res) {
    res.render('member')
}

function getAdminCheck (req, res) {
    res.render('admin')
}

async function postRegister (req, res) {
    // addUser(username, hash, salt, admin)
    const password = req.body.password
    const username = req.body.username

    const hash = await utils.passGen(password)

    const result = await db.addUser(username, hash, 12, false)
    if (result) {
        res.redirect('/login')
    } else {
        console.log('something went wrong')
        res.redirect('/register')
    }
}

async function postLogin (req, res) {
    const password = req.body.password
    const username = req.body.username

    const user = await db.findUser(username)

    if (!user) { 
        console.log('username dont exist')
        res.redirect('/login')
        return
    }

    const isValid = await utils.passValid(password, user.hash)
    
    if (isValid) {
        const jwt = await utils.issueJWT(user)
        res.cookie('token', jwt.token, { httpOnly: true, sameSite: 'lax' })
        console.log('login successful, jwt issued')
        res.redirect('/')
        return 
    } else {
        console.log('password is incorrect')
        res.redirect('/login')
        return
    }
    
}

function postLogout (req, res) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' })
    res.redirect('/')
}

async function postMemberCheck (req, res) {
    const memPass = req.body.memPass
    const userId = req.user.id
    console.log(memPass, userId)

    if (memPass === process.env.MEMPASS) {
        try {
            const user = await db.turnMember(userId)
            console.log(`user turned member -> ` +  req.user.username)
            res.redirect('/')
            return 
        } catch (err) {
            res.redirect('/')
            throw err
        }
    } else {
        console.log('wrong member password')
        res.render('member', { message: 'Wrong password' })
        return
    }
}

async function postAdminCheck (req, res) {
    const adminPass = req.body.adminPass
    const userId = req.user.id
    console.log(adminPass, userId)

    if (adminPass === process.env.ADMINPASS) {
        try {
            const user = await db.turnAdmin(userId)
            console.log(`user turned admin -> `, req.user.username)
            res.redirect('/')
        } catch (err) {
            res.redirect('/')
            throw err
        }
    } else {
        console.log('wrong admin password')
        res.render('admin', { message: 'Wrong password' })
        return
    }
}



module.exports = {
    getMainPage,
    getRegister,
    getLogin,
    getMemberCheck,
    getAdminCheck,
    postRegister,
    postLogin,
    postLogout,
    postMemberCheck,
    postAdminCheck
}
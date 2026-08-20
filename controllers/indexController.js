// controllers/indexController.js

const db = require('../db/queries')
const utils = require('../lib/utils')

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

    const isValid = utils.passValid(password, user.hash)
    
    if (isValid) {
        const jwt = utils.issueJWT(user)
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

function postMemberCheck (req, res) {
    console.log("do something with member stuff, pass submitted -> ", req.body.memPass)
    res.redirect('/')
}



module.exports = {
    getMainPage,
    getRegister,
    getLogin,
    getMemberCheck,
    postRegister,
    postLogin,
    postLogout,
    postMemberCheck
}
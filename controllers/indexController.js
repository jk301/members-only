// controllers/indexController.js

const db = require('../db/queries')
const utils = require('../lib/utils')
const dayJs = require('dayjs')

require('dotenv').config()

async function getMainPage (req, res) {
    const exist = req.user


    if (!exist) {
        let messages = await db.getAllMessage()
        messages.forEach(msg => {
            const newTime = dayJs(msg.time).format('MMM D, YYYY [at] h:mm A')
            msg.time = newTime
        })
        return res.render('index', { logged: false, messages: messages });
    }

    const messages = await db.getAllMessage()
    messages.forEach(msg => {
        const newTime = dayJs(msg.time).format('MMM D, YYYY [at] h:mm A')
        msg.time = newTime
    })

    if (exist.admin === true) {
        return res.render('index', { logged: true, user: exist, messages: messages, admin: true })
    } else if (exist.member === true) {
        return res.render('index', { logged: true, user: exist, messages: messages, member: true })
    } else {
        return res.render('index', { logged: true, user: exist, messages: messages })
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

function getMessage (req, res) {
    res.render('message')
}

async function postRegister (req, res) {
    // addUser(username, hash)
    const password = req.body.password
    const cnfrm_pass = req.body.cnfrm_pass
    const username = req.body.username

    if (password !== cnfrm_pass) {
        return res.render('register', {
            alerts: ["Passwords don't match."],
            username,
            password,
            cnfrm_pass
        })
    }

    try {
        const hash = await utils.passGen(password)

        const result = await db.addUser(username, hash)

        if (result) {
            return res.redirect('/login')
        } else {
            return res.render('register', {
                alerts: ["Couldn't add user for some reason"]
            })
        }

    } catch (err) {

        let msg = 'Something went wrong'

        if (err.code === "23505") {
            msg = 'Username is already taken.'
        }

        return res.render('register', {
            alerts: [msg],
            username
        })
    }

}

async function postLogin (req, res) {
    const password = req.body.password
    const username = req.body.username

    const user = await db.findUser(username)

    if (!user) { 
        return res.render('login', {
            alerts: ["The username doesn't exist."]
        })
    }

    const isValid = await utils.passValid(password, user.hash)
    
    if (isValid) {
        const jwt = await utils.issueJWT(user)
        res.cookie('token', jwt.token, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 })
        res.redirect('/')
        return 
    } else {
        return res.render('login', {
            alerts: ["The password isn't correct."], 
            username
        })
    }
    
}

function postLogout (req, res) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' })
    res.redirect('/')
}

async function postMemberCheck (req, res) {
    const memPass = req.body.memPass
    const userId = req.user.id

    if (memPass === process.env.MEMPASS) {
        try {
            const user = await db.turnMember(userId)
            res.redirect('/')
            return 
        } catch (err) {
            res.redirect('/')
            throw err
        }
    } else {
        return res.render('member', { 
            alerts: ['Wrong password'] 
        })
    }
}

async function postAdminCheck (req, res) {
    const adminPass = req.body.adminPass
    const userId = req.user.id

    if (adminPass === process.env.ADMINPASS) {
        try {
            const user = await db.turnAdmin(userId)
            res.redirect('/')
        } catch (err) {
            res.redirect('/')
        }
    } else {
        return res.render('admin', { 
            alerts: ['Wrong password'] 
        })
    }
}

async function postMessage (req, res) {
    const username = req.user.username
    const title = req.body.title
    const message = req.body.message

    const result = await db.addMessage(username, title, message)

    res.redirect('/')
}

async function deleteMessage(req, res) {
  const id = req.params.id;

  try {
    const result = await db.deleteMessage(id);
    if (!result) {
      return res.redirect('/');
    }
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting message');
  }
}



module.exports = {
    getMainPage,
    getRegister,
    getLogin,
    getMemberCheck,
    getAdminCheck,
    getMessage,

    postRegister,
    postLogin,
    postLogout,
    postMemberCheck,
    postAdminCheck,
    postMessage,
    deleteMessage
}
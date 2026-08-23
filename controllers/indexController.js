// controllers/indexController.js

const db = require('../db/queries')
const utils = require('../lib/utils')

require('dotenv').config()

// REMEMBER TO REMOVE CONSOLE LOGS

async function getMainPage (req, res) {
    const exist = req.user
    console.log(exist)

    if (!exist) {
        const messages = await db.getAllMessage()
        return res.render('index', { logged: false, messages: messages });
    }

    const messages = await db.getAllMessage()

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
    const username = req.body.username

    const hash = await utils.passGen(password)

    const result = await db.addUser(username, hash)
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

async function postMessage (req, res) {
    const username = req.user.username
    const title = req.body.title
    const message = req.body.message

    const result = await db.addMessage(username, title, message)

    console.log(title, message)
    res.redirect('/')
}

async function deleteMessage(req, res) {
  const id = req.params.id;

  try {
    const result = await db.deleteMessage(id);
    if (!result) {
      console.log("no message found with id -> " + id);
      return res.redirect('/');
    }
    console.log("message deleted with id -> " + result.messageid);
    res.redirect('/');
  } catch (err) {
    console.error(err);
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
// controllers/indexController.js

function getMainPage (req, res) {
    res.render('index')
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


function postRegister (req, res) {
    const password = req.body.password
    const username = req.body.username
    console.log('Register creds ->', username, password)
    res.redirect('/')
}

function postLogin (req, res) {
    const password = req.body.password
    const username = req.body.username
    console.log('Login creds ->', username, password)
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
    postMemberCheck
}
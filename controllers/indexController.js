// controllers/indexController.js

function getMainPage (req, res) {
    res.render('index')
}

module.exports = {
    getMainPage
}
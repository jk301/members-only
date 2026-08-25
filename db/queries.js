// db/queries.js

const pool = require('./db')

// just a template, subject to change

// Users

async function findUser (username) {
    const { rows } = await pool.query(`
        SELECT * FROM users 
        WHERE username = $1;    
    `, [username])
    return rows[0]
}

async function findById(userId) {
    const { rows } = await pool.query(`
        SELECT * FROM users 
        WHERE id = $1;    
    `, [userId])
    return rows[0]
}

async function addUser(username, hash) {
    const { rows } = await pool.query(`
        INSERT INTO users (username, hash) 
        VALUES ($1, $2) 
        RETURNING *;
    `, [username, hash])
    return rows[0]
}

async function turnAdmin(userId) {
    const { rows } = await pool.query(`
        UPDATE users
        SET admin = true
        WHERE id = $1 
        RETURNING *;    
    `, [userId])
}

async function turnMember(userId) {
    const { rows } = await pool.query(`
        UPDATE users
        SET member = true
        WHERE id = $1 
        RETURNING *;    
    `, [userId])
}

// Messages

async function getAllMessage() {
    const { rows } = await pool.query (`
        SELECT * FROM messages 
        ORDER BY messageid DESC;    
    `)
    return rows
}

async function addMessage(username, title, message) {
    const { rows } = await pool.query(`
        INSERT INTO messages (username, title, message) 
        VALUES ($1, $2, $3) 
        RETURNING *;
    `, [username, title, message])
    return rows[0]
}

async function deleteMessage (messageId) {
    const { rows } = await pool.query(`
        DELETE FROM messages 
        WHERE messageid = $1 
        RETURNING * ;    
    `, [messageId])
    return rows[0]
}


module.exports = {
    findUser,
    findById,
    addUser,
    turnAdmin,
    turnMember,
    getAllMessage,
    addMessage,
    deleteMessage
}
// db/queries.js

const pool = require('./db')

// just a template, subject to change

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

async function addUser(username, hash, salt, admin) {
    const { rows } = await pool.query(`
        INSERT INTO users (username, hash, salt, admin) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `, [username, hash, salt, admin])
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

module.exports = {
    findUser,
    findById,
    addUser,
    turnAdmin,
    turnMember
}
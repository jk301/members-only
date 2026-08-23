// db/pop.js


// will run this to create a table (not final)

// user table

// CREATE TABLE IF NOT EXISTS users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) UNIQUE NOT NULL,
//   hash VARCHAR(255) NOT NULL,
//   admin BOOL DEFAULT FALSE,
//   member BOOL DEFAULT FALSE
// );


// message table

// CREATE TABLE IF NOT EXISTS messages (
//   messageid SERIAL PRIMARY KEY,
//   username VARCHAR(255) NOT NULL REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE,
//   title VARCHAR(255) NOT NULL,
//   message VARCHAR(255) NOT NULL,
//   time TIMESTAMPTZ DEFAULT NOW()
// );
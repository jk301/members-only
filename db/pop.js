// db/pop.js


// will run this to create a table (not final)

// user table

// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) UNIQUE NOT NULL,
//   hash VARCHAR(255) NOT NULL,
//   salt VARCHAR(255) NOT NULL (non needed anymore because of using bcrypt),
//   admin bool,
//   member bool
// );


// message table

// CREATE TABLE messages (
//   messageid SERIAL PRIMARY KEY,
//   userid NUMBER NOT NULL (foreign key),
//   title VARCHAR(255) NOT NULL,
//   message VARCHAR(255) NOT NULL,
//   timestamp TIMESTAMPTZ ?
// );
const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const db = new pg.Pool({ connectionString });
// const email = "kassimbashir@gmail.com";
// db.query(`SELECT password FROM users WHERE email='${email}'`).then((result) => {
//   console.log(result.rows);
// });

module.exports = db;

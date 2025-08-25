import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import sequelize from "../db/sequelize.js";

const SequelizeStore = new connectSessionSequelize(session.Store);

//this code will create a session store
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "sessions",               // will create a "sessions" table
  checkExpirationInterval: 10 * 60 * 1000, // cleanup expired sessions every 10 mins
  expiration: 7 * 24 * 60 * 60 * 1000,     // session max age (ms) - 7 days
});

export default sessionStore;
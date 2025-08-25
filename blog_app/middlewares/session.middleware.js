import sessionStore from "../config/session.js";
import session from "express-session";
import dotenv from 'dotenv';
dotenv.config();


export const sessionMiddleware = session({
  name: "sessionId", // cookie name
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // true only behind HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,               // 7 days
  },
});
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './db/connect.js';
import sessionStore from './config/session.js';
import { sessionMiddleware } from './middlewares/session.middleware.js';
import appRouter from "./routes/app.route.js";
import viewRouter from "./views/index.js";
import seed from './seeders/seed.js';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// create an app
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tell express we’re using ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// set all the middlewares 

app.use(express.json());
app.use(express.urlencoded({extended:true,limit:'20kb'}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(sessionMiddleware);


app.use("/api/v1",appRouter);
app.use('/',viewRouter);



connectDB()
.then(() => {
    sessionStore.sync();
})
.then(()=>{
    seed();
})
.then(()=>{
    console.log("DB seeded successfully");
})
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is listening on PORT :',process.env.PORT);
    });
})

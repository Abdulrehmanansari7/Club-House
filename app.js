import express from "express";
import path from "path";
import  userRouter from "./routes/router.js";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import pool from "./db/db.js";
import bcrypt from "bcryptjs";

dotenv.config();

const __dirname = import.meta.dirname;

const app = express();
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({extended: false}));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));  
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(async (username,password,done) => {
        try {
            const {rows} = await pool.query("SELECT * FROM users WHERE username = $1",[username]);
            const user = rows[0];

            if(!user){
                return done(null, false, { message: "Incorrect username or Password" });
            }
            
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                return done(null,false, { message: "Incorrect Username or Password" })
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        
           if (rows.length === 0) {
            return done(null, false);
        }
        
        const user = rows[0];
        
        done(null, user);
    } catch (error) {
        done(error);
    }   
});

app.use((req,res,next) => {
    res.locals.user = req.user;
    next()
});

app.use("/", userRouter);

app.listen(3000,(err) => {
    console.log("SERVER IS RUNNING");
})
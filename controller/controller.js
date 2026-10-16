import { validationResult, matchedData } from "express-validator";
import queries from "../db/queries.js";
import bcrypt from "bcryptjs"
import passport from "passport";
import dotenv from "dotenv"

dotenv.config();

const getMsg = async (req, res, next) => {
  try {
    const msg = await queries.getMsg();
    res.render("index", { msg: msg });
  } catch (error) {
    next(error)
  }
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("signUp", {
      errors: errors.array(),
      username: req.body.username,
    });
  }
  try {
    const data = matchedData(req);
    const hashPassword = await bcrypt.hash(data.password,10);
    await queries.addUser(data.username,hashPassword);
    res.redirect("/login")
  } catch (err) {
     if (err.code === "23505") {
      return res.status(400).render("signUp", {
        errors: [{ msg: "Username already taken" }],
        username: req.body.username,
      });
    }
    next(err);
  }
};

const loginUser =  passport.authenticate("local", {    
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true,
    })


const logoutUser = (req,res,next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }

    res.redirect("/")
  })
}

const addMessage = async (req,res,next) => {
  try {
    const {title, text} = req.body;
    const userId = req.user.id

    await queries.addMessage(title,text,userId);
    res.redirect("/")
  } catch (error) {
    next(error);
  }
}

const deleteMsg = async (req,res,next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    const admin = req.user.is_admin;
    await queries.deleteMsg(messageId,userId,admin)
    res.redirect("/")
  } catch (error) {
    next(error)
  }
}

const updateMember = async (req,res,next) => {
  try {
    if(req.body.passcode !== process.env.MEMBERSHIP_PASSWORD) {
      return res.status(400).send("Incorrect membership password")
    }
    const id = req.user.id;
    await queries.updateMember(id);
    res.redirect("/")
  } catch (error) {
    next(error)
  }
}

export default {
  createUser,
  getMsg,
  loginUser,
  logoutUser,
  addMessage,
  deleteMsg,
  updateMember
};

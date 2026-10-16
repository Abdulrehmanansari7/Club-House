import { Router } from "express";
import middleware from "../middleware/authentication.js";
import controller from "../controller/controller.js"

const router = Router()

router.get("/", controller.getMsg);

router.post("/addUser", middleware.validateUser, controller.createUser);
router.get("/signup", (req,res) => res.render("signUp"));
router.get("/login", (req,res) => res.render("login"));
router.post("/login", controller.loginUser);
router.post("/logout",controller.logoutUser)
router.post("/messages/add", middleware.requireAuth, controller.addMessage)
router.post("/delete/:id", middleware.requireAuth, controller.deleteMsg)
router.post("/member", middleware.requireAuth, controller.updateMember)
// router.get("/check-session", (req, res) => {
//     res.json({
//         isAuthenticated: req.isAuthenticated(),
//         user: req.user ? req.user.username : null,
//         sessionID: req.sessionID
//     });
// });


export default router;
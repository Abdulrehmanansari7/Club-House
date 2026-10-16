import {body} from "express-validator"

const validateUser = [
    body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is Required")
    .bail()
    .isLength({ min: 2, max: 15})
    .withMessage("Username must be between 3 to 15 characters"),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 10 })
    .withMessage("Password must be between 8 and 10 characters")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .bail()
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
];

const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect("/login");
};

export default {
    validateUser,
    requireAuth
};
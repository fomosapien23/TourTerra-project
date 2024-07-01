const express =require ("express");
const router=express.Router();
const User= require("../MODELS/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport =require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../CONTROLLERS/user.js");
const { render } = require("ejs");


// Log the request method and URL
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//signup form render
router.get("/signup", userController.renderSignupForm)

//signup 
router.post("/signup", wrapAsync(userController.signup))

// login form render 
router.get("/login", userController.renderLoginForm)


// login 
router.post('/login', 
            saveRedirectUrl,
            passport.authenticate("local", {failureRedirect : '/login', failureFlash: true }),
            userController.login)

// logout route 
router.get("/logout",userController.logout)

module.exports=router;
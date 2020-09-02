var express = require('express');
const User = require('../models/user');
const passport = require('passport');
var router = express.Router();
//landing page
router.get('/', (req, res)=>{
    res.render('landing');
})

//show the register from
router.get("/register", (req,res)=>{
    res.render("register" , {page: "register"});
})

//handle sign up logic
router.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate('local')(req, res, ()=>{
            req.flash("success", "Welcome to Lib " + user.username +"!");
            res.redirect('/libs');
        })
    })
})

//show login form
router.get('/login', (req,res)=>{
    res.render('login', {page: 'login'});
})

//handle login logic
router.post("/login", passport.authenticate('local', 
    {
        successRedirect: "/libs",
        failureRedirect: "/login"
    }),(req,res)=>{
        
});
//logout
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect('/libs');
})


module.exports = router;
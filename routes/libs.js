var express = require('express');
var router = express.Router();
var Lib = require('../models/lib');
var Notation = require('../models/notation');


//Index Route
router.get('/', (req, res)=> {
    // get all data from db libs
    Lib.find({}, (err, allLibs)=>{
        if(err){
            console.log('can"t find data from db');
        } else{
            res.render("libs/libs", {libs:allLibs, page: 'libs'});
        }
    })
})


//New Route
router.get('/new', isLoggedIn, (req,res)=> {
    res.render("libs/new");
    
})

//Create Route
router.post('/', isLoggedIn, (req,res)=>{
    //add new data from form to database
    const name = req.body.name;
    const image = req.body.image;
    const newLib = {name:name, image:image, author: {id:req.user._id, username: req.user.username}};
    Lib.create(newLib, (err, newlyCreatedLib)=>{
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Lib successfully created!");
            res.redirect("/libs");
        }
    });
    
})

//Show Route -display more info about a lib
router.get('/:id', (req, res)=>{
    Lib.findById(req.params.id).populate('notations').exec((err, foundLib)=>{
        if(err){
            
            console.log(err);
        }else{
            
            res.render('libs/show', {Lib: foundLib});
        }
    });
});

//Edit 
router.get('/:id/edit', checkLibOwnership, (req,res)=>{
    Lib.findById(req.params.id, (err, foundLib)=>{
        if(err){
            req.flash("error", "Lib not found");
            res.redirect('/libs');
        }else{
            res.render('libs/edit', {lib: foundLib});
        }
    });
    
});


//Update
router.put('/:id', checkLibOwnership, (req,res)=>{
    Lib.findByIdAndUpdate(req.params.id, req.body.lib, (err, updatedLib)=>{
        if(err){
            req.flash("error", "Lib not found");
            res.redirect('/libs');
        }else{
            req.flash("success", "Lib updated");
            res.redirect('/libs/' + req.params.id)
        }
    })
    
});

//Delete
router.delete('/:id', checkLibOwnership, (req,res)=>{
    Lib.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Lib not found");
            res.redirect('/libs');
        }else{
            req.flash("success", "Lib successfully deleted!");
            res.redirect('/libs/');
        }
    })
})
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

function checkLibOwnership(req,res,next){
    if(req.isAuthenticated()){
        Lib.findById(req.params.id, (err, foundLib)=>{
            if(err){
                req.flash("error", "Lib not found");
                res.redirect("back");
            }else{
                if (!foundLib) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                //check ownership
                if(foundLib.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Perission denied.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You have to login first.");
        res.redirect("back");
    }
};
module.exports = router;
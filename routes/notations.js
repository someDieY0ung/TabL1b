var express = require('express');
var router = express.Router({mergeParams: true});
var Notation = require('../models/notation');
var Lib = require('../models/lib');
//================================
//New Route for Notation
router.get('/new', isLoggedIn, (req,res)=>{
    Lib.findById(req.params.id, (err,lib)=>{
        if(err){
            req.flash("error", "Lib not found.");
        }else{
            res.render('notations/new', {lib: lib});
        }
    })
    
})


//Create Route for Notation
router.post('/', isLoggedIn, (req,res)=>{
    //add new data from form to database
    Lib.findById(req.params.id, (err,lib)=>{
        if(err){
            req.flash("error", "Lib not found.");
            res.redirect('/libs');
        }else{
            
            const title = req.body.notation.title;
            const author = lib.name;
            const image = req.body.notation.image;
            const newNotation = {author:author, title:title, images: image};
            Notation.create(newNotation, (err, newlyCreatedNotation)=>{
                if(err){
                    req.flash("error", "Failed to create notation.");
                }else{
                    //associate the notation with its uploader
                    newlyCreatedNotation.uploader.id = req.user._id;
                    newlyCreatedNotation.uploader.username = req.user.username;
                    newlyCreatedNotation.save();
                    lib.notations.push(newlyCreatedNotation);
                    lib.save();
                    req.flash("success", "Notation successfully created!");
                    res.redirect("/libs/" + lib._id);
                }
            })
        }
    })
})
//Show Route - display more info about a notation
router.get('/:notation_id', (req, res)=>{
    
    Lib.findById(req.params.id).populate('notations').exec((err, foundLib)=>{
        if(err){
            req.flash("error", "Lib not found.");
            res.redirect('/libs');
        }else{
            Notation.findById(req.params.notation_id, (err,foundNotation)=>{
                if(err){
                    req.flash("error", "Notation not found.");
                    res.redirect('/libs');
                }else{
                    res.render('notations/show', {foundNotation: foundNotation, Lib: foundLib});
                }
            })
        }
    });
});


//Edit 
router.get('/:notation_id/edit', checkNotationOwnership, (req,res)=>{
    Lib.findById(req.params.id).populate('notations').exec((err, foundLib)=>{
        if(err){
            req.flash("error", "Lib not found.");
        }else{
            Notation.findById(req.params.notation_id, (err,foundNotation)=>{
                if(err){
                    req.flash("error", "Notation not found.");
                    res.redirect('/libs/' +req.params.id);
                }else{
                    res.render('notations/edit', {foundNotation: foundNotation, lib: foundLib});
                }
            })
        }
    });
    
});


//Update
router.put('/:notation_id', checkNotationOwnership, (req,res)=>{
    Notation.findByIdAndUpdate(req.params.notation_id, {images: req.body.notation.image, title: req.body.notation.title}, (err,foundNotation)=>{
        if(err){
            req.flash("error", "Notation not found.");
            res.redirect('/libs/' +req.params.id);
        }else{
            req.flash("success", "Notation successfully updated!");
            res.redirect('/libs/' +req.params.id +'/notations/' + req.params.notation_id);
        }
    });
});

//Delete
router.delete('/:notation_id', checkNotationOwnership, (req,res)=>{
    Lib.findById(req.params.id).populate('notations').exec((err, foundLib)=>{
        if(err){
            req.flash("error", "Lib not found.");
        }else{
            Notation.findById(req.params.notation_id, (err, foundNotation)=>{
                if(err){
                    req.flash("error", "Notation not found.");
                    res.redirect('/libs/' +req.params.id);
                }else{
                    foundLib.update(
                        { $pull: {notations: foundNotation}}
                    );
                }
            })
            
            Notation.findByIdAndRemove(req.params.notation_id, (err)=>{
                if(err){
                    req.flash("error", "Notation not found.");
                    res.redirect('/libs/' +req.params.id);
                }else{
                    req.flash("success", "Notation successfully removed!");
                    res.redirect('/libs/' +req.params.id);
                }
            })
        }
    });
})
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to login first.");
    res.redirect("/login");
};

function checkNotationOwnership(req,res,next){
    if(req.isAuthenticated()){
        Notation.findById(req.params.notation_id, (err, foundNote)=>{
            if(err){
                req.flash("error", "Notation not found.");
                res.redirect("back");
            }else{
                //check ownership
                if (!foundNote) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundNote.uploader.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to delete this notation.");
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
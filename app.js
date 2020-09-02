const express       = require("express"),
      app           = express(),
      
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),     
      passport      =require("passport"),
      LocalStrategy = require("passport-local"),  
      flash         = require("connect-flash"),
      methodOverride = require('method-override')
      //models    
      Lib           = require('./models/lib'),            
      Notation      = require('./models/notation'), 
      User          = require('./models/user')
      //routes
const libRoutes      = require('./routes/libs'),
      notationRoutes = require('./routes/notations'),
      authRoutes     = require('./routes/index')


//seedDB();
console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL,{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'));
app.use(flash());

// Passport Configuration
app.use(require('express-session')({
    secret: "I am virgin",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
      
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("error");
    next();
});

app.use('/', authRoutes);
app.use('/libs', libRoutes);
app.use('/libs/:id/notations/', notationRoutes);

var port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('TyL has started !');
})
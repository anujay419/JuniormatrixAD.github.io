const express = require("express")
const bodyParser = require("body-parser")
const ejs  = require("ejs");
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMognoose = require("passport-local-mongoose")

const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    secret:"Our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://anujay:Anujay2003@cluster0.uc1it.mongodb.net/JuniorMatrix?retryWrites=true&w=majority")
// mongoose.connect("mongodb://localhost:27017/JuniorMatrix")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(passportLocalMognoose);

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// -------------------------------------GET REQUESTS-------------------------------------

app.get("/", function(req,res){
    res.render("index")
})

app.get("/register", function(req,res){
    res.render("register")
})

app.get("/logout", function(req,res){
    req.logOut()
    res.redirect("/")
})

app.get("/calender", function(req,res){
    if (req.isAuthenticated()){
        res.render("calender")
    } else {
        res.redirect("/")
    }
    // User.find({"":{$ne: null}}, function(err, foundSecrets){
    //     if (err){
    //         console.log(err)
    //     } else{
    //         if (foundSecrets){
    //             res.render("calender")
    //         }
    //     }
    // })
})

// -------------------------------POST REQUESTS-------------------------------

app.post("/register", function(req,res){
    User.register({username: req.body.useremail}, req.body.userpassword, function(err, user){
        if (err){
            console.log(err)
            res.redirect("/register")
        } else {
            passport.authenticate("local"),
            res.redirect("/calender")
            
        }
    })
})

app.post("/", function(req,res){
    const user = new User({
        username: req.body.useremail,
        password: req.body.userpassword
    });
    req.login(user, function(err){
        if (err){
            console.log(err)
        } else {
            passport.authenticate("local"),
            res.redirect("/calender")
            
        }
    })
})

app.listen(process.env.PORT || 3000, function(req,res){
    console.log("Server listening at port 3000")
})
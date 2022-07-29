// Requiring-dependencies
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");


const app = express();

// database-Connection
mongoose.connect("mongodb://localhost:27017/secretDb", {
    useNewUrlParser: true
});

// static-File-Connection
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const saltRounds = 10;

// dataBase-Schema's
const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }

});

// dataBase-Model 
const newUser = mongoose.model("newUsers", userSchema);

// Get Requests
app.get("/", function (req, res) {
    res.render('home');
});

app.get("/login", function (req, res) {
    res.render('login');
});

app.get("/register", function (req, res) {
    res.render('register');
});

// Post Request
app.post("/register", function (req, res) {

    // using bcrypt to salt-hash password
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err)
        } else {
            const User = new newUser({
                username: req.body.username,
                password: hash
            });

            User.save(function (err) {
                if (err) {
                    console.log(err)
                } else {
                    res.render('secrets')
                }
            });
        }

    });


});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;

    newUser.findOne({
        username: userName
    }, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                bcrypt.compare(passWord, foundUser.password, function (err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        if (result == true) {
                            res.render('secrets')
                        }
                    } 
                });
            }

        }

    });
});



// server-feedBack
app.listen(3000, function () {
    console.log("server is running on port 3000.");
});
// Requiring-dependencies
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const md5 = require("md5");

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
    const User = new newUser({
        username: req.body.username,
        password: md5(req.body.password)
    });

    User.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render('secrets')
        }
    });
});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const passWord = md5(req.body.password);

    newUser.findOne({
        username: userName
    }, function (err, result) {
        if (!err) {
            if (result.password === passWord) {
                res.render('secrets')
            } else {
                res.render('login')
            }
        } else {
            console.log(err)
        }
    });
});

// server-feedBack
app.listen(3000, function () {
    console.log("server is running on port 3000.");
});
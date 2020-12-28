//BUILD SERVER
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-Parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//SET UP DATABASE CONNECTION, SCHEMA and USER MODEL

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

//BUILD RESTFUL API CONNECTIONS

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")

  .get(function (req, res) {
    res.render("login");
  })

  .post(function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });

app
  .route("/register")

  .get(function (req, res) {
    res.render("register");
  })

  .post(function (req, res) {
    let userName = req.body.username;
    let password = req.body.password;

    let newUser = new User({
      email: userName,
      password: password,
    });

    newUser.save(function (err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

app.listen(3000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listening on port 3000.  Press Ctr + C to exit.");
  }
});

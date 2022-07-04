var express = require("express");
var router = express.Router();
var connection = require("../lib/db");

//display login page
router.get("/", function (req, res, next) {
  res.render("auth/login", {
    title: "Login",
    email: "",
    password: "",
  });
});

//authenticate user
router.post("/authentication", function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var name;

  connection.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    function (err, rows, fields) {
      if (err) throw err;

      if (rows.length <= 0) {
        req.flash("error", "Please correct enter email adn password!");
        res.redirect("/auth");
      } else {
        req.session.loggedin = true;
        req.session.name = name;
        res.redirect("/books");
      }
    }
  );
});

// display home page
router.get("/home", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("/home", {
      title: "Dashboard",
      name: req.session.name,
    });
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

// logout user
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  //   req.flash("success", "Login Again here");
  res.redirect("/auth");
});

module.exports = router;

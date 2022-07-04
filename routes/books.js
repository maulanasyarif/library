var express = require("express");
var router = express.Router();
var connection = require("../lib/db");

// display books page
router.get("/", function (req, res, next) {
  if (req.session.loggedin) {
    connection.query(
      "SELECT * FROM books ORDER BY id DESC",
      function (err, rows) {
        if (err) {
          req.flash("error", err);
          res.render("books", { data: "" });
        } else {
          res.render("books", { data: rows });
        }
      }
    );
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

// display add book page
router.get("/add", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("books/add", {
      name: "",
      author: "",
    });
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

//add new book
router.post("/add", function (req, res, next) {
  if (req.session.loggedin) {
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
      errors = true;

      req.flash("error", "Please enter name and author");

      res.render("books/add", {
        name: name,
        author: author,
      });
    }

    if (!errors) {
      var form_data = {
        name: name,
        author: author,
      };

      connection.query(
        "INSERT INTO books SET ?",
        form_data,
        function (err, result) {
          if (err) {
            req.flash("error", err);
            res.render("books/add", {
              name: name,
              author: author,
            });
          } else {
            req.flash("success", "Book added successfully");
            res.redirect("/books");
          }
        }
      );
    }
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

//display edit books page
router.get("/edit/(:id)", function (req, res, next) {
  if (req.session.loggedin) {
    let id = req.params.id;

    connection.query(
      "SELECT * FROM books WHERE id = " + id,
      function (err, rows, fields) {
        if (err) throw err;

        if (rows.length <= 0) {
          req.flash("error", "Books not found with id = " + id);
          res.redirect("/books");
        } else {
          res.render("books/edit", {
            title: "Edit Book",
            id: rows[0].id,
            name: rows[0].name,
            author: rows[0].author,
          });
        }
      }
    );
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

//update book data
router.post("/update/:id", function (req, res, next) {
  if (req.session.loggedin) {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
      errors = true;

      req.flash("error", "Please enter name and author");
      res.render("boooks/edit", {
        id: req.params.id,
        name: name,
        author: author,
      });
    }

    if (!errors) {
      var form_data = {
        name: name,
        author: author,
      };

      connection.query(
        "UPDATE books SET ? WHERE id=" + id,
        form_data,
        function (err, results) {
          if (err) {
            req.flash("error", err);
            res.render("books/edit", {
              id: req.params.id,
              name: form_data.name,
              author: form_data.author,
            });
          } else {
            req.flash("success", "Book successfully updated");
            res.redirect("/books");
          }
        }
      );
    }
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

//delete book
router.get("/delete/(:id)", function (req, res, next) {
  if (req.session.loggedin) {
    let id = req.params.id;

    connection.query(
      "DELETE FROM books WHERE id = " + id,
      function (err, results) {
        if (err) {
          req.flash("error", err);
          req.redirect("/books");
        } else {
          req.flash("success", "Book successfully deleted! ID =" + id);
          res.redirect("/books");
        }
      }
    );
  } else {
    req.flash("success", "please login first");
    res.redirect("/auth");
  }
});

module.exports = router;

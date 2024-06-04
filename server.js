const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const app = express();
const _ = require("lodash");
const moment = require("moment");
const marked = require("marked");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = new sqlite3.Database(":memory:");

db.serialize(function () {
  db.run("CREATE TABLE users (id INT, name TEXT)");
});


app.get("/lodash", function (req, res) {
  let array = [1];
  let other = _.concat(array, 2, [3], [[4]]);
  res.send(other);
});

app.get("/moment", function (req, res) {
  res.send(moment().format("MMMM Do YYYY, h:mm:ss a"));
});

app.get("/marked", function (req, res) {
  let markdown = marked("# Marked in Node.js\n\nRendered by **marked**.");
  res.send(markdown);
});
// SQL Injection vulnerability
app.get("/users", function (req, res) {
  let sql = `SELECT * FROM users WHERE id = ${req.query.id}`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// XSS vulnerability
app.get("/search", function (req, res) {
  res.send(`Search results for: ${req.query.q}`);
});

// Path Traversal vulnerability
app.get("/files", function (req, res) {
  let filePath = path.join(__dirname, req.query.path);
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      throw err;
    }
    res.send(data);
  });
});

app.listen(3000, function () {
  console.log("App is listening on port 3000");
});

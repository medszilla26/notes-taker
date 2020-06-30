//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");
const { uuid } = require("uuidv4");

var app = express();

var PORT = process.env.PORT || 8000;

var data = fs.readFileSync("db.json");
var notes = JSON.parse(data);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//html routes

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.json(notes);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//adds note
app.post("/api/notes", function (req, res) {
  var addNote = req.body;

  addNote.id = uuid();
  notes.push(addNote);
  if (addNote) {
    fs.writeFile("db.json", JSON.stringify(notes, null, 3), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("Note Added!");
    });
    res.json(addNote);
  }
});

//deletes note
app.delete("/api/notes/:id", function (req, res) {
  var id = req.params.id;

  notes = notes.filter((note) => {
    return note.id != id;
  });

  fs.writeFile("db.json", JSON.stringify(notes, null, 3), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("Note Deleted!");
  });
  res.json(notes);
});

//displays port connection on terminal
app.listen(PORT, function () {
  console.log("App is listening on PORT " + PORT);
});

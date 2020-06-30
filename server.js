//dependencies

var express = require("express");
var path = require("path");
const fs = require("fs");
const { uuid } = require("uuidv4");

var app = express();

var PORT = process.env.PORT || 8080;

var data = fs.readFileSync("db.json");
var notes = JSON.parse(data);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//html routes

app.get("/notes", function (request, respond) {
  respond.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (request, respond) {
  respond.json(notes);
});

app.get("*", function (request, respond) {
  respond.sendFile(path.join(__dirname, "./public/index.html"));
});

//adds note
app.post("/api/notes", function (request, respond) {
  var addNote = request.body;

  addNote.id = uuid();
  notes.push(addNote);
  if (addNote) {
    fs.writeFile("db.json", JSON.stringify(notes, null, 3), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("Note Added!");
    });
    respond.json(addNote);
  }
});

//deletes note
app.delete("/api/notes/:id", function (request, respond) {
  var id = request.params.id;

  notes = notes.filter((note) => {
    return note.id != id;
  });

  fs.writeFile("db.json", JSON.stringify(notes, null, 3), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("Note Deleted!");
  });
  respond.json(notes);
});

//starts server and displays port connection on terminal
app.listen(PORT, function () {
  console.log("App is listening on PORT " + PORT);
});

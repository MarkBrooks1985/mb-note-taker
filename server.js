const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  readFromFile,
  readAndAppend,
  removeNote,
} = require("./helpers/fsUtils");
const uuidv1 = require("uuid/v1");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// html routes to be made: GET /notes which returns notes.html

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET /api/notes should read the db.json file and return all saved notes as json

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST /api/notes should recieve a new note to save on the request body and add it to db.json and return the new note to the client
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv1(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully`);
  } else {
    res.error("Error in adding note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id);
  removeNote(req.params.id);
  res.send(`${req.method} request to delete a note has been recieved`);
});

// GET * aka wildcard should return index.html

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// find away to make each note a new id (look at npm packages that could do this)
// DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete.
// To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

// bonus add a functionallity to delete notes on the front end

// expose deleting point which accept a note diary

// read the file

// filter all the notes except the id being deleted

// write back the content to db.json

// look up how to accept parameter, in route

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

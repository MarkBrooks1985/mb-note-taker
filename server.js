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

// get route for sending to the notes.html

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// get route for requesting data

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// post route for adding new notes

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

// deletes the note

app.delete("/api/notes/:id", (req, res) => {
  removeNote(req.params.id);
  res.send(`${req.method} request to delete a note has been recieved`);
});

// Wildcard route that sends to the index page

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// writes the data

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// listens to the port

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

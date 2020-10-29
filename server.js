// dependencies & requirements
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// set the port variable
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// GET  `/` - Should return the homepage
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET `/notes` - Should return the `notes.html` file
app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
	fs.readFile("db/db.json", "utf8", (err, data) => {
		if (err) {
			throw err;
		} else {
			res.json(JSON.parse(data));
		}
	});
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
	// create the new note based off the user input
	let newNote = {
		title: req.body.title,
		text: req.body.text,
	};
	// read the db.json file
	let data = fs.readFileSync("db/db.json");
	// parse the file to change it from a string to an array
	let array = JSON.parse(data);
	// push the new note onto the array of notes
	array.push(newNote);
	// turn the data back into an array
	data = JSON.stringify(array);
	// write the data to the db.json file
	fs.writeFileSync("db/db.json", data);
	// send a response to the server
	res.send({ msg: "Note saved to the database!" });
});

// DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

// Listen for the server on our PORT
app.listen(PORT, () =>
	console.log(`Server listening at http://localhost:${PORT}`)
);

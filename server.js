// dependencies & requirements
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const shortid = require("shortid");

// set the port variable
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// middleware that ensures the css and jquery code works properly on the site and in the server
// it allows you to use static directories/static files
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
	// read the db.json file
	let data = fs.readFileSync("db/db.json");
	// parse the file to change it from a string to an array
	let array = JSON.parse(data);
	// create the new note based off the user input
	let newNote = {
		id: shortid.generate(),
		title: req.body.title,
		text: req.body.text,
	};
	// push the new note onto the array of notes
	array.push(newNote);
	// turn the data back into an array
	data = JSON.stringify(array);
	// write the data to the db.json file
	fs.writeFileSync("db/db.json", data);
	// send a response to the server
	res.send({ msg: "Note saved to the database!" });
});

// DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete.
app.delete("/api/notes/:id", (req, res) => {
	// read the data from the db.json file
	let data = fs.readFileSync("db/db.json");
	// parse the file to change it from a string to an array
	let array = JSON.parse(data);
	console.log(array);
	// remove the unique note from the data array
	let note = req.params.id;
	// if the note doesn't exist, send a 400 error
	if (!note)
		return res.status(400).send("The note with the given id was not found.");
	// find the note within the index
	const index = array.indexOf(note);
	// remove that single note from the data array
	array.splice(index, 1);
	// turn the data back into an array
	data = JSON.stringify(array);
	// write the data to the db.json file
	fs.writeFileSync("db/db.json", data);
	// send a response to the server
	res.send({ msg: "Note deleted from the database!" });
});

// GET - If no matching route is found default to home
// put after all other defined routes so that this didn't overwrite those routes
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Listen for the server on our PORT
app.listen(PORT, () =>
	console.log(`Server listening at http://localhost:${PORT}`)
);

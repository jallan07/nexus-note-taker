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

// storage for all saved tasks
const saved = fs.readFile("/db/db.json");

// Main route for the homepage
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET `/notes` - Should return the `notes.html` file
app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
	res.json(saved);
});

app.listen(PORT, () =>
	console.log(`Server listening at http://localhost:${PORT}`)
);

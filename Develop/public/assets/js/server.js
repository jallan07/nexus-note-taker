// dependencies & requirements
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

// set the port variable
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route for homepage
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../.././index.html"));
});

app.listen(PORT, () =>
	console.log(`Server listening at http://localhost:${PORT}`)
);

// Importing Required Modules
const express = require("express"); // Import the Express module for creating the server api
const X2JS_lib = require("x2js"); // Import the X2JS_lib module for XML to JS Object conversion
const cors = require("cors");
var request = require("request"); // Import the Request module for making HTTP requests


const x2js = new X2JS_lib(); // Create an instance of X2JS

const app = express(); // Create an instance of the Express

app.use(cors({ origin: "*" }));
app.use(express.json()); // Register the middleware for parsing JSON

const port = 3000; // Set the port number for the server

const kamar_options = {
  method: "POST",
  url: "https://kamarportal.mags.school.nz/api/api.php",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "KAMAR API Demo",
    Origin: "file://",
    "X-Requested-With": "nz.co.KAMAR",
  },
}; // Configuration options for making requests to the KAMAR API

// Function to calculate rankscore based on result grade and credits
const find_rankscore = (results) => {
  // Map through the results
  return results.map((result) => {
    let temp_rs; // Variable to store the calculated rankscore

    // Calculate rankscore based on result grade and credits
    if (result.Grade === "Achieved with Excellence")
      temp_rs = 4 * parseInt(result.Credits);
    if (result.Grade === "Achieved with Merit")
      temp_rs = 3 * parseInt(result.Credits);
    if (result.Grade === "Achieved")
      temp_rs = 2 * parseInt(result.Credits);
    if (result.Grade === "Not Achieved") temp_rs = 0;

    // Return modified result standard with rankscore
    return {
      number: parseInt(result.Number),
      subject: result.Title.split(/\d/)[0].trim(), // Get the subject name from the result title (before the first number)
      subfield: result.SubField,
      grade: result.Grade,
      credits: parseInt(result.Credits),
      rankscore: temp_rs,
      description: result.Title,
    };
  });
};

// Route for authenticating the user
app.post("/api/auth", (req, res) => {
  request(
    {
      ...kamar_options, // Required headers for making requests to the KAMAR API // Required headers for making requests to the KAMAR API
      form: {
        Command: "Logon",
        Key: "vtku",
        Username: req.body.username,
        Password: req.body.password,
      },
    },
    (error, response, body) => {
      if (error) res.status(400).json(error); // Send error response if there is an error

      let logon_results = x2js.xml2js(body).LogonResults; // Parse the XML response to JS Object

      if (logon_results.Success) {
        // Send successful authentication response
        res.status(200).json({
          logon_level: parseInt(logon_results.LogonLevel), // Login level of the user
          student_id: logon_results.CurrentStudent, // Student ID of the user
          student_key: logon_results.Key, // Student key of the user, required for retrieving results
        });
      } else if (logon_results.ErrorCode === "0") {
        // Send authentication error response
        res.status(400).json({
          logon_level: parseInt(logon_results.ErrorCode), // Login level of the user
          error: logon_results.Error, // Error message of the error
        });
      } else res.status(406).json(logon_results); // Send unparsed response if there is an error
    }
  );
});

// Route for retrieving student results
app.post("/api/results", (req, res) => {
  request(
    {
      ...kamar_options, // Required headers for making requests to the KAMAR API
      form: {
        Command: "GetStudentResults",
        Key: req.body.student_key,
        StudentID: req.body.student_id,
      },
    },
    (error, response, body) => {
      if (error) res.status(400).json(error); // Send error response if there is an error

      let kamar_data = x2js.xml2js(body).StudentResultsResults; // Parse the XML response to JavaScript

      if (kamar_data.AccessLevel === "1") {
        let filter_results = kamar_data.ResultLevels.ResultLevel[0].Results.Result; // Get the results from the response

        filter_results = find_rankscore(filter_results); // Apply the find_rankscore function to the results

        // Send successful results response
        res.status(200).json({
          logon_level: parseInt(kamar_data.AccessLevel), // Login level of the user
          ncea_level: parseInt(kamar_data.ResultLevels.ResultLevel[0].NCEALevel), // NCEA level of the user
          results: filter_results, // Results of the user
        });
      } else if (kamar_data.AccessLevel !== "1" && kamar_data.AccessLevel !== undefined) {
        // Send results error response
        res.status(400).json({
          logon_level: parseInt(kamar_data.AccessLevel), // Login level of the user
          error: kamar_data.Error, // Error message of the error
        });
      } else res.status(406).json(kamar_data); // Send unparsed response if there is an error
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

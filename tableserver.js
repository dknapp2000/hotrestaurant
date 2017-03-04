// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require( "fs" );

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

console.log( "Working on port " + PORT );

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Star Wars table (DATA)
// =============================================================
var counts = {
    home: 0,
    tables: 0,
    reserve: 0,
    apiTables: 0,
    apiClear: 0,
    apiNew: 0,
    apiWaitList: 0
};

var table = [
    { customerName: "Matthew",
      phoneNumber: "7777777777",
      customerEmail: "matt@gmail.com",
      customerID: 1
}];

var waits = [{ customerName: "Matt",
      phoneNumber: "7777777777",
      customerEmail: "matt@gmail.com",
      customerID: 1
}];

// Routes
// =============================================================
function saveData() {
    fs.writeFile( "tables.json", JSON.stringify( table ), "UTF8", function() {
        console.log( "Table data saved to disk." );
    })
    fs.writeFile( "waits.json", JSON.stringify( waits ), "UTF8", function() {
        console.log( "Waits data saved to disk." );
    })
}

function restoreData() {
    fs.readFile( "tables.json", "UTF8", function( err,data ) { 
        if ( err ) throw err;
        table = JSON.parse( data );
        console.log( table );
    })
    fs.readFile( "waits.json", "UTF8", function( err, data ) {
        if ( err ) throw err;
        waits = JSON.parse( data );
        console.log( waits );
    })
}

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "home.html"));
  counts.home++;
});

app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname, "table.html"));
  counts.tables++;
});

app.get("/reserve", function( req, res ) {
  res.sendFile(path.join(__dirname, "reserve.html"));
  counts.reserve++;
})

// Search for Specific Character (or all table) - provides JSON
app.get("/api/waitlist", function(req, res) {
  return res.json(waits);
  counts.apiWaitlist++;
});

app.get("/api/tables", function(req, res) {
  return res.json(table);
  counts.apiTables++;
});

app.get("/api/counts", function( req, res ) {
    res.json(counts);
})
app.post("/api/clear", function(req, res) {
    table = [];
    waits = [];
    saveData();
    counts.apiClear++;
});




app.post("/api/new", function(req, res) {
  var newTable = req.body;

  console.log(newTable);

  if ( table.length < 5 ) {
    table.push(newTable);
    newTable.result = 'reservation';
  } else {
      waits.push(newTable);
      newTable.result = 'waitList'
  }
  res.json(newTable)
  saveData();
  counts.apiNew++;
});

// Starts the server to begin listening
// =============================================================

restoreData();

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

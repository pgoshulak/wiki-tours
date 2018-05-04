"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");
const favouritesRoutes = require("./routes/favourites");

// Modules for querying the database
const usersDb = require('./modules/users')(knex)
const mapsDb = require('./modules/maps')(knex)

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(usersDb));

//-------------Maps Routes------------------

app.use("/api/maps", mapsRoutes(mapsDb));

//------------Favourites Routes----------

app.use("/api/maps", favouritesRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    partialName: 'featured'
  });
});

// Map viewer
app.get("/map/:id", (req, res) => {
  let mapId = req.params.id;

  Promise.all([
    mapsDb.getMapData(mapId),
    mapsDb.getMapPoints(mapId),
    mapsDb.getMapFavourites(mapId)
  ]).then(results => {
    // Store results for rendering
    let [ mapData, mapPoints, mapFavourites ] = results;

    // Render the results
    res.render("index", {
      partialName: 'map_viewer',
      mapId,
      mapData,
      mapPoints,
      mapFavourites
    });
  }).catch(err => {
    console.error(err);
  })
});

// Map editor
app.get("/map/:id/edit", (req, res) => {
  // Check for user logged in here
  // ...
  res.render("index", {
    partialName: 'map_editor',
    mapId: req.params.id
  });
});

//-----------User Profile-------------
app.get("/profile", (req, res) => {
  res.render("index", {
    partialName: "userProfile"
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});



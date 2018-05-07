"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const cookieSession = require('cookie-session');
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

// lets app use cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

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

app.use(cookieSession({
  name: 'session',
  secret: "COOKIE_SESSION_SECRET"
}));

//----------- Get user id from cookie ------------
app.use((req, res, next) => {
  const user_id = req.session.user_id || -1;
  req.currentUser = user_id;
  next();
});

// Home page
app.get("/", (req, res) => {
  Promise.all([
    mapsDb.getAllMaps()
  ]).then(results => {
    let [allMaps] = results;

    res.render("index", {
      partialName: 'featured',
      user: req.currentUser,
      allMaps: allMaps
    });
  })

  // res.render("index", {
  //   partialName: 'featured',
  //   user: req.currentUser
  // });
});

// New map
app.get("/map/new", (req, res) => {
  // If user not logged in, redirect to home
  let user = req.currentUser;
  if (user === -1) {
    res.redirect('/');
    return;
  }

  // Create new map in DB then redirect to editor page
  mapsDb.addNewMap(user)
    .then((mapId) => {
      res.redirect(`/map/${mapId}/edit`)
    })
    .catch((err) => {
      console.log(err);
    })
});

// Map viewer
app.get("/map/:id", (req, res) => {
  let mapId = req.params.id;

  Promise.all([
    mapsDb.getMapData(mapId),
    mapsDb.getApprovedMapPoints(mapId),
    mapsDb.getMapFavourites(mapId),
    mapsDb.getMapContributors(mapId)
  ]).then(results => {
    // Store results for rendering
    let [ [mapData], mapPoints, mapFavourites, mapContributors ] = results;

    // Render the results
    res.render("index", {
      partialName: 'map_viewer',
      mapId,
      mapData,
      mapPoints,
      mapFavourites,
      mapContributors,
      user: req.currentUser
    });
  }).catch(err => {
    console.error(err);
  })
});

// Map editor
app.get("/map/:id/edit", (req, res) => {
  // If user not logged in, redirect to home
  let user = req.currentUser;
  if (user === -1) {
    res.redirect('/');
    return;
  }
  res.render("index", {
    partialName: 'map_editor',
    mapId: req.params.id,
    user
  })
});

//-----------User Profile-------------
app.get("/profile", (req, res) => {
  var user_id = req.session.user_id

  Promise.all([
    mapsDb.getUserMap(user_id),
    usersDb.getUserFavourites(user_id),
    usersDb.getUserContributedMaps(user_id),
    usersDb.getUser(user_id)
  ]).then(results => {
    var [userMaps, userFavourites, UserContributed, user] = results;

    res.render("index", {
      partialName: "userProfile",
      user: req.currentUser,
      userInfo: user,
      userMaps: userMaps,
      userFavourites: userFavourites,
      UserContributed: UserContributed
    });
  }).catch(err => {
    console.error(err);
  })
});

//-----------Login--------------------
// Default to user id = 1
app.get('/login', (req, res) => {
    res.redirect('/login/1');
  });

// Login with other users
app.get('/login/:id', (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
//---------------------------------------

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});



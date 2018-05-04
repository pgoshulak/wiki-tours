"use strict";

const express = require('express');
const router = express.Router();

module.exports = (usersDb) => {

//----------Get Routes------------
  router.get("/", (req, res) => {
    usersDb.getAllUsers()
      .then((results) => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  router.get("/:id", (req, res) => {
    usersDb.getUser(req.params.id)
      .then((results) => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  router.get("/:id/favourites", (req, res) => {
    usersDb.getUserFavourites(req.params.id)
      .then((results) => {
        res.json(results);
      })
      .catch(function (err) {
        console.error(err);
      });
  });

  return router;
}

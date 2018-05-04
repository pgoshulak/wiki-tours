"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  const users = require('../modules/users.js')(knex);

  router.get("/", (req, res) => {
    users.getAllUsers()
      .then((results) => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  router.get("/:id", (req, res) => {
    users.getUser(req.params.id)
      .then((results) => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  router.get("/:id/favourites", (req, res) => {
    users.getUserFavourites(req.params.id)
      .then((results) => {
        res.json(results);
      })
      .catch(function (err) {
        console.error(err);
      });
  });


  return router;
}

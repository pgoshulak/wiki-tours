"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

//---------Get Routes-------------
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/:id", (req, res) => {
    knex('maps').where({
      id: req.params.id
    }).select('*')
    .then((results) => {
      res.json(results);
    })
  });

  router.get("/:id/points", (req, res) => {
    knex('points').where({
      map_id: req.params.id
    }).select('*')
    .then((results) => {
      res.json(results)
    })
  });

  router.get("/:id/favourites", (req, res) => {
    knex('users')
    .join('favourites', 'users.id', '=', 'user_id')
    .select('*')
    .where({
      map_id: req.params.id
    })
    .then((results) => {
      res.json(results)
    })
  });

//---------Post Routes-----------
  return router;
}

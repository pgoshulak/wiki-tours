"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

//----------Get Routes------------
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    }).catch(function(err) {
      console.error(err);
    });
  });

  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .from("users")
      .where({
        id:req.params.id
      })
      .then((results) => {
        res.json(results);
    }).catch(function(err) {
      console.error(err);
    });
  });

  router.get("/:id/favourites", (req, res) => {
    knex
      .select("*")
      .from("favourites")
      .where({
        user_id: req.params.id
      })
      .then((results) => {
        res.json(results);
      })
      .catch(function(err) {
        console.error(err);
    });
  });


  return router;
}

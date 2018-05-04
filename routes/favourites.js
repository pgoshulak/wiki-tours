"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/:id/favourites", (req, res) => {
    knex('favourites')
    .returning('id')
    .insert(
      {
        map_id: req.params.id,
        //grab session cookie later
        user_id: "1"
      }
    ).then(results => {
      res.json(results);
    }).catch(function(err) {
      console.error(err);
    });
  });

  router.delete("/:id/favourites", (req, res) => {
    knex('favourites')
    .where({
      id: req.params.id
    }).del()
    .then(() => {
      res.send("deleted");
    })
    .catch(function(err) {
      console.error(err);
    });
  });

  return router;
}

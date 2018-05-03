"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/:id/favourites", (req, res) => {
    knex('points')
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

    })
  });

//   knex('accounts')
// .where('activated', false)
// .del()

  return router;
}

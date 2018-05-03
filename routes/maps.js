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

  router.post("/:id/points", (req, res) => {
    knex('points')
    .returning('id')
    .insert(
      { map_id: req.params.id,
        contributor_id: req.body.user_id,
        title: req.body.title,
        description: req.body.description,
        image_url: req.body.image_url,
        embed_url: req.body.embed_url,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        owner_approved: req.body.owner_approved}
    ).then(results => {
      res.json(results);
    }).catch(function(err) {
      console.error(err);
    });
  });

//make this work with cookies later for owner_id
  router.post("/", (req, res) => {
    knex('maps')
    .returning('id')
    .insert({
      owner_id: "1",
      category_id: req.body.category_id,
      title: req.body.title,
      description: req.body.description,
      thumbnail_url: req.body.thumbnail_url
    }).then(results => {
      res.json(results);
    }).catch(function(err) {
      console.error(err);
    });
  });

//--------PUT ROUTES--------------------

router.put("/:id", (req, res) => {
    knex('maps')
    .where({id:req.params.id})
    .update({...req.body})
    .then(results => {
      res.json(results);
    }).catch(function(err) {
      console.error(err);
    });
  });


  return router;
}

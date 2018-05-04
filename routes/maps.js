"use strict";

const express = require('express');
const router = express.Router();


module.exports = (knex) => {
  const maps = require('../modules/maps.js')(knex);

  //---------Get Routes-------------
  router.get("/", (req, res) => {
    maps.getAllMaps()
      .then((results) => {
        res.json(results);
      });
  });

  router.get("/:id", (req, res) => {
    maps.getMapData(req.params.id)
      .then((results) => {
        res.json(results);
      })
  });

  router.get("/:id/points", (req, res) => {
    maps.getMapPoints(req.params.id)
      .then((results) => {
        res.json(results)
      })
  });

  router.get("/:id/favourites", (req, res) => {
    maps.getMapFavourites(req.params.id)
      .then((results) => {
        res.json(results)
      })
  });

  //---------Post Routes-----------

  router.post("/:id/points", (req, res) => {
    maps.addMapPoint(req.params.id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  //make this work with cookies later for owner_id
  router.post("/", (req, res) => {
    maps.addNewMap()
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  //--------PUT ROUTES--------------------

  router.put("/:id", (req, res) => {
    maps.updateMap(req.params.id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  return router;
}

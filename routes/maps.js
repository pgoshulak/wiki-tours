"use strict";

const express = require('express');
const router = express.Router();


module.exports = (mapsDb) => {

  //---------Get Routes-------------
  router.get("/", (req, res) => {
    mapsDb.getAllMaps()
      .then((results) => {
        res.json(results);
      });
  });

  router.get("/:id", (req, res) => {
    mapsDb.getMapData(req.params.id)
      .then((results) => {
        res.json(results);
      })
  });

  router.get("/:id/points", (req, res) => {
    mapsDb.getMapPoints(req.params.id)
      .then((results) => {
        res.json(results)
      })
  });

  router.get("/:id/favourites", (req, res) => {
    mapsDb.getMapFavourites(req.params.id)
      .then((results) => {
        res.json(results)
      })
  });

  //---------Post Routes-----------

  router.post("/:id/points", (req, res) => {
    mapsDb.addMapPoint(req.params.id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  //make this work with cookies later for owner_id
  router.post("/", (req, res) => {
    mapsDb.addNewMap()
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  //--------PUT ROUTES--------------------

  router.put("/:id", (req, res) => {
    mapsDb.updateMap(req.params.id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  return router;
}

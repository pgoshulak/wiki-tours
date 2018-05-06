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

  router.get("/:id/points/approved", (req, res) => {
    mapsDb.getApprovedMapPoints(req.params.id)
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

  // Add new map point
  router.post("/:id/points", (req, res) => {
    mapsDb.addMapPoint(req.params.id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  // Add new map
  router.post("/", (req, res) => {
    mapsDb.addNewMap()
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  // Set map to favourite
  router.post('/:id/favourites', (req, res) => {
    mapsDb.addFavourite(req.params.id, req.body.user_id)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  })

  //--------PUT ROUTES--------------------

  router.put("/:id", (req, res) => {
    mapsDb.updateMap(req.params.id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  router.put("/:map_id/points/:point_id", (req, res) => {
    mapsDb.updatePoint(req.params.point_id, req.body)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  });

  // ----------- DELETE Routes -------------
  router.delete("/:map_id/points/:point_id", (req, res) => {
    mapsDb.deletePoint(req.params.point_id)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  })

  // Unfavourite a map
  router.delete('/:id/favourites', (req, res) => {
    mapsDb.removeFavourite(req.params.id, req.body.user_id)
      .then(results => {
        res.json(results);
      }).catch(function (err) {
        console.error(err);
      });
  })


  return router;
}

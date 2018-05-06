"use strict";

const express = require('express');

module.exports = (knex) => {
  return {
    // Get all maps in the database
    getAllMaps() {
      return knex
        .select("*")
        .from("maps")
    },
    // Get a single map's data by an ID
    getMapData(id) {
      return knex('maps')
        .where({
          id: id
        })
        .select('*')
    },
    // Get all points in a given map
    getMapPoints(map_id) {
      return knex('points')
        .where({
          map_id: map_id
        })
        .select('*')
    },
    getApprovedMapPoints(map_id) {
      return knex('points')
        .where({
          map_id: map_id,
          owner_approved: true
        })
        .select('*')
    },
    // Get users who have favourited a map
    getMapFavourites(map_id) {
      return knex('users')
        .join('favourites', 'users.id', '=', 'user_id')
        .select('*')
        .where({
          map_id: map_id
        })
    },

    getUserMap(user_id) {
      return knex('maps')
        .select('*')
        .from('maps')
        .where({owner_id: user_id})
    },
    // ----------------- POST Routes ---------------------

    // Post a point
    addMapPoint(map_id, pointData) {
      return knex('points')
        .returning('id')
        .insert({
          map_id: map_id,
          contributor_id: pointData.user_id,
          title: pointData.title,
          latitude: pointData.latitude,
          longitude: pointData.longitude,
          owner_approved: pointData.owner_approved,
          image_url: pointData.image_url
        })
    },

    // Create a new map
    addNewMap() {
      return knex('maps')
        .returning('id')
        .insert({
          owner_id: "1",
          category_id: req.body.category_id,
          title: req.body.title,
          description: req.body.description,
          thumbnail_url: req.body.thumbnail_url
        })
    },

    // ------------ PUT Routes ------------------
    updateMap(map_id, mapData) {
      return knex('maps')
        .where({
          id: map_id
        })
        .update({ ...mapData
        })
    },

    updatePoint(point_id, pointData) {
      return knex('points')
        .where({
          id: point_id
        })
        .update({ ...pointData })
    },
    
    // ----------- DELETE Routes ---------------
    deletePoint(point_id) {
      return knex('points')
        .where({id: point_id})
        .del()
    } 
  }
}

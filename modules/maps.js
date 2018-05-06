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
          contributor_id: pointData.contributor_id,
          title: pointData.title,
          latitude: pointData.latitude,
          longitude: pointData.longitude,
          owner_approved: pointData.owner_approved,
          image_url: pointData.image_url
        })
    },

    // Create a new map
    addNewMap(user_id) {
      return knex('maps')
        .returning('id')
        .insert({
          owner_id: user_id
        })
    },

    // Favourite a map
    addFavourite(mapId, userId) {
      return knex('favourites')
        .insert({
          map_id: mapId,
          user_id: userId
        })
    },

    // ------------ PUT Routes ------------------
    updateMap(map_id, mapData) {
      return knex('maps')
        .where({
          id: map_id
        })
        .update({ ...mapData,
          date_updated: knex.fn.now()
        })
    },

    updatePoint(point_id, pointData) {
      return knex('points')
        .where({
          id: point_id
        })
        .update({ ...pointData,
          date_updated: knex.fn.now()
        })
    },
    
    // ----------- DELETE Routes ---------------
    deletePoint(point_id) {
      return knex('points')
        .where({id: point_id})
        .del()
    },
    
    // Unfavourite a map
    removeFavourite(mapId, userId) {
      return knex('favourites')
        .where({
          map_id: mapId,
          user_id: userId
        })
        .del()
    },
  }
}

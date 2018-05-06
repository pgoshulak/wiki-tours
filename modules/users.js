"use strict";

const express = require('express');

module.exports = (knex) => {
  return {
    // Get all users in the database
    getAllUsers() {
      return knex
        .select("*")
        .from("users")
    },
    // Get users by id in the database
    getUser(id) {
      return knex
        .select("*")
        .from("users")
        .where({
          id: id
        })
    },
    // Get all users in the database
    getUserFavourites(user_id) {
      return knex('favourites')
        .join('maps', 'favourites.map_id', '=', 'maps.id')
        .where ({user_id: user_id})
        .select('*')
    },

    getUserContributedMaps(user_id){
      return knex('points')
        .join('maps' , 'points.map_id', '=', 'maps.id')
        .where({contributor_id: user_id})
        .distinct('maps.id')
        .select('maps.id', 'maps.title', 'maps.description', 'maps.date_created', 'maps.date_updated', 'maps.thumbnail_url')
    }
  }
}

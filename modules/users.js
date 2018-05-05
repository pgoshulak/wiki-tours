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
      return knex('maps')
        .join('points' , 'maps.id', '=', 'map_id')
        .where({contributor_id: user_id})
        .select('*')
    }
  }
}

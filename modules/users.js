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
    // Get all users in the database
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
      return knex
        .select("*")
        .from("favourites")
        .where({
          user_id: user_id
        })
    }
  }
}

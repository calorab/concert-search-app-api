"use strict";

const mongoose = require('mongoose');

// add user ID
const followedArtistsSchema = new mongoose.Schema({
    artistName: {
        type: String,
        required: false
    },
    artistId: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: false
    }
});

const FollowedArtists = mongoose.model('FollowedArtists', followedArtistsSchema);

module.exports = FollowedArtists;

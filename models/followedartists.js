"use strict";

const mongoose = require('mongoose');


const followedArtistsSchema = new mongoose.Schema({
    artistName: {
        type: String,
        required: false
    },
    artistId: {
        type: String,
        required: false
    },
    artistUrl: {
        type: String,
        required: false
    }
});

const FollowedArtists = mongoose.model('FollowedArtists', followedArtistsSchema);

module.exports = FollowedArtists;

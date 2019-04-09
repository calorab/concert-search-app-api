"use strict";

const mongoose = require('mongoose');


const followedArtistsSchema = new mongoose.Schema({
    //change type to relavent data later
    artistName: {
        type: String,
        required: false
    },
    artistId: {
        type: String,
        required: false
    },
    // CALEB-------URL is valid for "type"?-------
    artistUrl: {
        type: URL,
        required: false
    }
});

const FollowedArtists = mongoose.model('FollowedArtists', followedArtistsSchema);

module.exports = FollowedArtists;

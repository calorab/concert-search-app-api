const express = require('express');

const cors = require('cors');
const {CLIENT_ORIGIN, DATABASE_URL} = require('./config');
const User = require('./models/users');
const FollowedArtists = require('./models/followedartists');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const https = require('https');
const http = require('http');
const request = require('request');

// -------need webpack??? -------

var unirest = require('unirest');
var events = require('events');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server;

function runServer(urlToUse) {
    console.log(urlToUse, typeof urlToUse);
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, { useNewUrlParser: true }, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            })
                .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}

//----------- Built in for testing -----------


const PORT = process.env.PORT || 3000;

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});


// ---------------USERS ENDPOINTS-------------------------------------
// POST -----------------------------------
// creating a new user
app.post('/users/create', (req, res) => {

    //take the name, username and the password from the ajax api call
    let username = req.body.username;
    let password = req.body.password;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();

    //create an encryption key
    bcrypt.genSalt(10, (err, salt) => {

        //if creating the key returns an error...
        if (err) {

            //display it
            return res.status(500).json({
                message: 'Internal server error key'
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {

            //if creating the ncrypted pasword returns an error..
            if (err) {

                //display it
                return res.status(500).json({
                    message: 'Internal server error ncrypted'
                });
            }

            //using the mongoose DB schema, connect to the database and create the new user
            User.create({
                username,
                password: hash,
            }, (err, item) => {

                //if creating a new user in the DB returns an error..
                if (err) {
                    //display it
                    return res.status(500).json({
                        message: 'Internal Server Error userdb'
                    });
                }
                //if creating a new user in the DB is succefull
                if (item) {

                    //display the new user
                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// signing in a user
app.post('/users/login', function (req, res) {

    //take the username and the password from the ajax api call
    const username = req.body.username;
    const password = req.body.password;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        username: username
    }, function (err, items) {

        //if the there is an error connecting to the DB
        if (err) {

            //display it
            return res.status(500).json({
                message: "Internal server error"
            });
        }
        // if there are no users with that username
        if (!items) {
            //display it
            return res.status(401).json({
                message: "Not found!"
            });
        }
        //if the username is found
        else {

            //try to validate the password
            items.validatePassword(password, function (err, isValid) {

                //if the connection to the DB to validate the password is not working
                if (err) {

                    //display error
                    console.log('Could not connect to the DB to validate the password.');
                }

                //if the password is not valid
                if (!isValid) {

                    //display error
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                }
                //if the password is valid
                else {
                    //return the logged in user
                    console.log(`User \`${username}\` logged in.`);
                    return res.json(items);
                }
            });
        };
    });
});
// ---------------END OF USER ENDPOINTS-------------------------------------

// ---------------THIRD PARTY Artist API CALL-------------------------------------

let getArtistFromSongkick = function (artist) {
    return new Promise((resolve, reject) => {
        let options = {
            url: 'https://api.songkick.com/api/3.0/search/artists.json?apikey=ZOV7FltnOvfdD7o9&query=' + artist,
            headers: {
                'User-Agent': 'request'
            }
        };
        request(options, (error, response, body) => {
            if (error) return reject(error);
            let info = JSON.parse(body);
            resolve(info);
        });
    });
};

//-------CALEB Will need another function to format the data above per Daniel    974908(lady gaga)

app.get('/songkick/:artist', function (req, res) {

    getArtistFromSongkick(req.params.artist).then(artist => {
        res.json(artist);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});


// ---------------THIRD PARTY Concert API CALL-------------------------------------

let getConcertsByArtist = function (artistId) {
    return new Promise((resolve, reject) => {
        let options = {
            url: 'https://api.songkick.com/api/3.0/artists/' + artistId + '/calendar.json?apikey=ZOV7FltnOvfdD7o9',
            headers: {
                'User-Agent': 'request'
            }
        };
        request(options, (error, response, body) => {
            if (error) return reject(error);
            let info = JSON.parse(body);
            resolve(info);
        });
    });
};

app.get('/songkick/concerts/:artistId', function (req, res) {

    getConcertsByArtist(req.params.artistId).then(concertResponse => {
        res.json(concertResponse);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});
// -------------END THIRD PARTY ENDPOINTS------------------------------------------------



// -------------FollowedArtists ENDPOINTS------------------------------------------------
// POST -----------------------------------------
//email: testemail@gmail.com | password: 12345 (I think...) | userId: 5cb5a84d0c0aeb2ec15aa722
// creating a new followed artist
app.post('/followedArtists/create', (req, res) => {
    let artistName = req.body.artistName;
    let artistId = req.body.artistId;
    let userId = req.body.userId;

    console.log(artistName, artistId, userId, 'line 276');

    // Save in the DB
    FollowedArtists.create({
        artistName,
        artistId,
        userId
    }, (err, data) => {
        console.log(data);
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (data) {
            return res.json(data);
        }
    });
});

// GET -----------------------------------------
app.get('/followedArtists/:userId', function (req, res) {
    FollowedArtists
        .find({
        userId: req.params.userId
    }).exec().then(function (followedArtists) {
        console.log('line 303');
        return res.json(followedArtists);
    })
        .catch(function (followedArtists) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

// DELETE ----------------------------------------
//deleting a followedArtist by id CALEB
app.delete('/followedArtists/:id', function (req, res) {
    FollowedArtists.findByIdAndRemove(req.params.id).exec().then(function (followedArtists) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});
// -------------END FollowedArtists ENDPOINTS------------------------------------------------

module.exports = {app, runServer, closeServer};

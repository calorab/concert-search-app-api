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

// -------need webpack??? -------

var unirest = require('unirest');
var events = require('events');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server;

function runServer(urlToUse) {
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
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

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
                message: 'Internal server error'
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {

            //if creating the ncrypted pasword returns an error..
            if (err) {

                //display it
                return res.status(500).json({
                    message: 'Internal server error'
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
                        message: 'Internal Server Error'
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



// -------------FollowedArtists ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// creating a new Investment
app.post('/followedArtists/create', (req, res) => {
    let artistName = req.body.artistName;
    let artistId = req.body.artistId;
    //unsure if i'm going to keep this one***
    let artistUrl = req.body.artistUrl;

    console.log(artistName, artistId);

    //external api function call and response -------- DIRK - Keep this way if API call from client??
    let searchReq = getFromBarchart(investmentSymbol);

    //get the data from the first api call
    searchReq.on('end', function (portfolioDetailsOutput) {
        console.log(portfolioDetailsOutput);

        //After gettig data from API, save in the DB
        FollowedArtists.create({
            artistName,
            artistId,

            //CALEB -------UPDATE!!-------

            artistUrl: portfolioDetailsOutput.results[0].lastPrice
        }, (err, addedPortfolioDataOutput) => {
            console.log(addedPortfolioDataOutput);
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if (addedPortfolioDataOutput) {
                return res.json(addedPortfolioDataOutput);
            }
        });
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });



});

// PUT --------------------------------------
//app.put('/investment/:symbol', function (req, res) {
//    let toUpdate = {};
//
//    let updateableFields = ['investmentSymbol'];
//    updateableFields.forEach(function (field) {
//        if (field in req.body) {
//            toUpdate[field] = req.body[field];
//        }
//    });
//    //    console.log(toUpdate);
//    Investment
//        .findByIdAndUpdate(req.params.id, {
//        $set: toUpdate
//    }).exec().then(function (output) {
//        return res.status(204).end();
//    }).catch(function (err) {
//        return res.status(500).json({
//            message: 'Internal Server Error'
//        });
//    });
//});


// GET ------------------------------------

//DIRK -------- Is get-artist-by-id needed?

// accessing a single investment by id
app.get('/investment/:id', function (req, res) {
    Investment
        .findById(req.params.id).exec().then(function (investment) {
        return res.json(investment);
    })
        .catch(function (investment) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

// DELETE ----------------------------------------
// deleting an investment by id CALEB
app.delete('/investment/:id', function (req, res) {
    Investment.findByIdAndRemove(req.params.id).exec().then(function (investment) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});
// -------------END FollowedArtists ENDPOINTS------------------------------------------------

module.exports = {app};

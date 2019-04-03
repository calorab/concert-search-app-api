//const express = require('express');

const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
//const User = require('./models/user');
//const Investment = require('./models/investment');
//const Portfolio = require('./models/portfolios');
const bodyParser = require('body-parser');
//const config = require('./config');
const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const https = require('https');
const http = require('http');

//var unirest = require('unirest');
//var events = require('events');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
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


app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

const PORT = process.env.PORT || 3000;

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};

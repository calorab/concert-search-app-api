const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');


const User = require('../models/users');
const FollowedArtists = require('../models/followedartists');
const {app, runServer, closeServer} = require('../server');

const {
    TEST_DATABASE_URL
} = require('../config');

const should = chai.should();
chai.use(chaiHttp);

function generateUser() {
    return {
        username: faker.internet.email(),
        password: faker.internet.password()
    }
}

function seedUserData() {
    console.info('Seeding user data');
    const seedData = [];

    for (let i = 1; i < 10; i++) {
        seedData.push(generateUser());
    }
    return User.insertMany(seedData);
}

function generateArtistData() {
    return {
        artistName: 'Alison Wonderland',
        artistId: '4769598',
        userId: '5cb5a84d0c0aeb2ec15aa722'
    }
}

function seedArtistData() {
    console.info('Seeding artist data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateArtistData());
    }
    //    console.log(seedData);


    return FollowedArtists.insertMany(seedData);
}


// Tear down Database after each test
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}


// --------------- Test User Endpoints ---------------

describe('User API resource', function (done) {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
            err
            }));
    });

    beforeEach(function () {
        return seedUserData();
    });

    // Test create a new user
    it('should create a new user', function () {
        const newUser = generateUser();
        return chai.request(app)
            .post('/users/create')
            .send(newUser)
            .then(function (res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.include.keys('username', 'password');
            res.body.username.should.equal(newUser.username);
            res.body.password.should.not.equal(newUser.password);
            res.body._id.should.not.be.null;
        });
        done();
    });


    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});


// --------------- Test Investment Endpoints ---------------

describe('FollowedArtists API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
            err
        }));
    });

    //MARIUS
    beforeEach(function () {
        return seedArtistData();
    });

    // Test create a new portfolio
    it('should create a FollowedArtist', function () {
        const newFollowedArtist = generateArtistData();
        return chai.request(app)
            .post('/followedArtists/create')
            .send(newFollowedArtist)
            .then(function (res) {
            console.log(res);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.include.keys(
                'artistName',
                'artistId',
                'userId'
                );
            res.body._id.should.not.be.null;
        });
    });

    //CALEB  example delete !!!

    it('should delete a followedArtist by ID', function () {
        let artist;
        return FollowedArtists
            .findOne()
            .then(function (_artist) {
            console.log(_artist);
            artist = _artist;
            return chai.request(app).delete(`/followedArtists/${_artist._id}`);
        })
            .then(function (res) {
            res.should.have.status(204);
            return FollowedArtists.findById(artist._id)
        })
            .then(function (_artist) {
            should.not.exist(_artist);
        });
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});


describe('API', function() {

    it('should 200 on GET requests', function() {
        return chai.request(app)
            .get('/api/fooooo')
            .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
        });
    });
});

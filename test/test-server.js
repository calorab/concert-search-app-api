const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');

// -------set up model fro Users-------
const User = require('../models/user');
const {app, runServer, closeServer} = require('../server');
const {
    TEST_DATABASE_URL
} = require('../config');

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

describe('User API resource', function () {

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
    });


    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});


// CALEB-------confirm set up of config.js with test database url is correct-------
const {
    TEST_DATABASE_URL
} = require('../config');

const should = chai.should();
chai.use(chaiHttp);

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

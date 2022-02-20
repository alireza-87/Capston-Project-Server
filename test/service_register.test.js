const repos = require('../storage/repository')
const {
    user_register
} = require('../services/service_register')
const model_user = require('../models/model_user')
const dotenv = require('dotenv');
dotenv.config();
let repository = new repos();

beforeAll(async () => {
    console.log("Before All")
    let repository = new repos()
    repository.init()
})

afterAll(async (done) => {
    model_user.deleteMany().then((res) => done())
});

test('Expect register user in database', async done => {

    function callback(err, data) {
        expect(err).toBe(null);
        repository.update_user_verification("1111111111111111", (err, res) => {
            done()
        })

    }

    let data = {
        userName: "test54556",
        password: "Amega111sdadasa$",
        email: "klop@test56556.com",
        confirmed: false,
        name: "ali",
        surename: "uuuuu",
        birthDay: "2014-01-22",
        role_user: true,
        mobile: "+398889999",
        avatar: "avatar1",
        codiceFiscale: "1111111111111111"
    }
    user_register(data, callback)
})

test('Expect Fail register , Username Validation', async done => {

    function callback(err, data) {
        expect(err).toBe("userName");
        done()
    }

    let data = {
        userName: "",
        password: "Amega111sdadasa$",
        email: "klop@test56556.com",
        confirmed: false,
        name: "un1",
        surename: "uuuuu",
        birthDay: "2014-01-22",
        role_user: true,
        mobile: "+398889999",
        avatar: "avatar1",
        codiceFiscale: "1111111111111111"
    }
    user_register(data, callback)
})

test('Expect Fail register , Email Validation', async done => {

    function callback(err, data) {
        expect(err).toBe("email");
        done()
    }

    let data = {
        userName: "test54556",
        password: "Amega111sdadasa$",
        email: "",
        confirmed: false,
        name: "un1",
        surename: "uuuuu",
        birthDay: "2014-01-22",
        role_user: true,
        mobile: "+398889999",
        avatar: "avatar1",
        codiceFiscale: "1111111111111111"
    }
    user_register(data, callback)
})

test('Expect Fail register , No Email', async done => {

    function callback(err, data) {
        expect(err).toBe("email");
        done()
    }

    let data = {
        userName: "test54556",
        password: "Amega111sdadasa$",
        confirmed: false,
        name: "un1",
        sureName: "uuuuu",
        birthDay: "2014-01-22",
        role_user: true,
        mobile: "+398889999",
        avatar: "avatar1",
        codiceFiscale: "1111111111111111"
    }
    user_register(data, callback)
})

const repos = require('../storage/repository.js')

const {
    login_user
} = require('../services/service_login')
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
        userName: "alice3",
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
// ---------------------------------------------------------


test('vaild login', async done => {

    function callback(err, data) {
        try {
            expect(data.userName).toBe("alice3")
            done();
        } catch (err) {
            done(err);
        }
    }

    let data = {
        username: "alice3",
        password: "Amega111sdadasa$"
    }
    login_user(data, callback)
});

test('invalid - password login', async done => {

    function callback(err, data) {
        try {
            expect(err.message).toBe('the credentials are invalid');
            done();
        } catch (err) {
            done(err);
        }
    }

    let data = {
        username: "alice3",
        password: "test"
    }
    login_user(data, callback)
});

test('Invalid -username - login', async done => {


    function callback(err, data) {
        try {
            expect(err.message).toBe('the credentials are invalid');
            done();
        } catch (err) {
            done(err);
        }
    }

    let data = {
        username: "test",
        password: "password"
    }
    login_user(data, callback)
});

test('invalid -email  - login', async done => {


    function callback(err, data) {
        try {
            expect(err.message).toBe("the credentials are invalid")
            done();
        } catch (err) {
            done(err);
        }
    }

    let data = {
        email: "email5@tt56556.com",
        password: "password"
    }
    login_user(data, callback)
});

test('valid email with role - login', async done => {


    function callback(err, data) {
        try {
            expect(data.email).toBe("klop@test56556.com")
            done();
        } catch (err) {
            done(err);
        }
    }

    let data = {
        email: "klop@test56556.com",
        password: "password"

    }
    login_user(data, callback)
});


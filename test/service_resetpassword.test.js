const repos = require('../storage/repository')
const {
    user_register
} = require('../services/service_register')
const {
    reset_password
} = require('../services/service_resetpassword')

const {
    forget_password
} = require('../services/service_fogetpassword')

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

test('forget password', async done => {

    function callback(err, data) {
        expect(data.userName).toBe("alice3");
        to = data.Token.token
        done()
    }

    let data = {
        username: "alice3",
    }
    forget_password(data, callback)
});
// ----------------------------------------------------------


test('invalid password - reset-password', async done => {
    function callback(err, data) {
        expect(err.message).toBe("Passwords not Equal");
        done()
    }

    let data = {
        token: to,
        password: "testpassword",
        confirmPassword: "testpassword1"
    }
    reset_password(data, callback)
});

test('reset-password', async done => {
    function callback(err, data) {
        expect(data.value.userName).toBe("alice3");
        done()
    }

    let data = {
        token: to,
        password: "Amega111sdadasa$",
        confirmPassword: "Amega111sdadasa$"
    }
    reset_password(data, callback)
});

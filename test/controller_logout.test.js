const repos = require('../storage/repository')
const creatServer = require('../app')
const model_user = require('../models/model_user')
const dotenv = require('dotenv');
const {
    user_register
} = require('../services/service_register')
const request = require('supertest')
dotenv.config();

const server = creatServer()
let coockie
let repository = new repos();

beforeAll(() => {
    console.log("Before All")
    // let repository = new repos()
    // repository.init()
})

afterAll(async (done) => {
    model_user.deleteMany().then((res) => done())
});

test("Test LogoutController /register", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice3","email":"test7@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"Ali","surename":"Karimi","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            repository.update_user_verification("1111111111111111", (err, res) => {
                done()
            })

        })
})


test("Test LogoutController /login", async (done) => {
    let data = {
        username: "alice3",
        password: "Amega111sdadasa$"
    }

    const res = await request(server)
        .post("/login")
        .send(data)
        .expect(200)
        .then((response) => {
            coockie = response.header["set-cookie"]
            expect(response.body.result).toEqual('success')
            done()
        })

})

test("Test LogoutController /logout", async (done) => {

    const res = await request(server)
        .get("/logout")
        .set("Cookie", coockie)
        .expect(200)
        .then((response) => {

            expect(response.body.result).toEqual('success')
            done()
        })

})

const repos = require('../storage/repository')
const creatServer = require('../app')
const model_user = require('../models/model_user')
const dotenv = require('dotenv');
var to;
const request = require('supertest')
const {
    forget_password
} = require('../services/service_fogetpassword')
const {
    user_register
} = require('../services/service_register')
dotenv.config();

const server = creatServer()
let repository = new repos();

beforeAll(async () => {
    console.log("Before All")

    let repository = new repos()
    repository.init()

})

afterAll(async (done) => {
    model_user.deleteMany().then((res) => done())
});

test("Test controllerResetPass /register", async (done) => {

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice3","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        //.attach('avatar', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            repository.update_user_verification("1111111111111111", (err, res) => {
                done()
            })

        })
})


test("Test controllerResetPass /foget_password", async (done) => {
    let data = {
        username: "alice3"
    }
    const res = await request(server)
        .put("/foget_password")
        .send(data)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            to = response.body.data.token
            done()
        })

})

// ----------------------------------------------------------


test("Test  controllerResetPass /reset_password -  reset_password", async (done) => {
    let data = {
        token: to,
        password: "testpas",
        confirmPassword: "Amega111sdadasa$"

    }
    const res = await request(server)
        .put("/reset_password")
        .send(data)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Passwords not Equal')
            done()
        })
})


test("Test controllerResetPass /reset_password", async (done) => {
    let data = {
        token: to,
        password: "Amega11r1sdadasa$",
        confirmPassword: "Amega11r1sdadasa$"
    }
    const res = await request(server)
        .put("/reset_password")
        .send(data)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })
})

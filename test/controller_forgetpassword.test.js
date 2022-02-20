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
let repository = new repos();

beforeAll(async () => {
    console.log("Before All")
    let repository = new repos()
    repository.init()

})

afterAll(async (done) => {
    model_user.deleteMany().then((res) => done())
});

test("Test /register", async (done) => {

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


// ----------------------------------------------------------
test("Test / vaild username forgetpassword", async (done) => {
    let data = {
        username: "alice3"
    }
    const res = await request(server)
        .put("/foget_password")
        .send(data)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })

})

test("Test / valid email forgetpassword", async (done) => {
    let data = {
        email: "test@test.com"
    }
    const res = await request(server)
        .put("/foget_password")
        .send(data)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })

})

test("test/ invalid username - forgetpassword", async (done) => {
    let data = {
        username: "test"

    }
    const res = await request(server)
        .put("/foget_password")
        .send(data)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('the credentials are invalid')
            done()

        })
})
test("test/ invalid  email- forgetpassword", async (done) => {
    let data = {
        email: "test@123.com"

    }
    const res = await request(server)
        .put("/foget_password")
        .send(data)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('the credentials are invalid')
            done()

        })


})

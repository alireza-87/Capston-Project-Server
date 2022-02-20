const repos = require('../storage/repository')
const creatServer = require('../app')
const model_product = require('../models/model_product')
const request = require('supertest')
const dotenv = require('dotenv');
const model_user = require('../models/model_user')
dotenv.config();
const server = creatServer()
let repository = new repos();

afterAll(async (done) => {
    model_user.deleteMany().then((res) => model_product.deleteMany().then((res) => done()));
});

test("Test ControllerCard /register", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata','{"userName":"alice7","email":"test7@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"Alireza","surename":"Karimi","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            repository.update_user_verification("1111111111111111", (err, res) => {
                done()
            })
            done()
        })
})

let cookie;
test("Test ControllerCard /login", async (done) => {
    let data = {
        username: "alice7",
        password: "Amega111sdadasa$"
    }

    const res = await request(server)
        .post("/login")
        .send(data)
        .expect(200)
        .then((response) => {
            cookie=response.header["set-cookie"]
            expect(response.body.result).toEqual('success')
            done()
        })

})

test("Test ControllerCard /check", async (done) => {
    var data = {
        cardNumber: "2720436952038488",
        expiryMonth: "12",
        expiryYear: "2021",
        cvv: "214"
    }
    const res = await request(server)
        .post("/card/check")
        .send(data)
        .set("Cookie", cookie)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })
})

test("Test ControllerCard not valid /check", async (done) => {
    var data = {
        cardNumber: "2720436952038489",
        expiryMonth: 12,
        expiryYear: 2021,
        cvv: 214
    }
    const res = await request(server)
        .post("/card/check")
        .send(data)
        .set("Cookie", cookie)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            done()
        })
})


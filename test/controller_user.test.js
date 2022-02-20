const repos = require('../storage/repository')
const creatServer = require('../app')
const model_user = require('../models/model_user')
const request = require('supertest')
const fs = require('fs')
const dotenv = require('dotenv');
const rimraf = require('rimraf');
dotenv.config();
const server = creatServer()
let repository = new repos();

beforeAll( () => {
    let repository=new repos()
    repository.init()
})

afterAll(async (done) => {
    try{
        fs.rmdir('.\/'+process.env.DIR_UPLOAD_TEST, { recursive: true }, (err) => {
            model_user.deleteMany().then((res) => done())
        });
    }
    catch{
        rimraf('.\/'+process.env.DIR_UPLOAD_TEST, () => {
            model_user.deleteMany().then(() => done())
        });
    }
});
let coockie

test("Test ControllerUser /register", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata','{"userName":"alice","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            repository.update_user_verification("1111111111111111", (err, res) => {
                done()
            })

        })
})


test("Test ControllerUser - /login", async (done) => {
    let data = {
        username: "alice",
        password: "Amega111sdadasa$"
    }
    const res = await request(server)
        .post("/login")
        .send(data)
        .expect(200)
        .then((response) => {
            coockie=response.header["set-cookie"]
            expect(response.body.result).toEqual('success')
            done()
        })

})

test("Test ControllerUser - /user/verify", async (done) => {
    let data={codiceFiscale:1111111111111111}
    const res = await request(server)
        .put("/user/verify")
        .set("Cookie",coockie)
        .send(data)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            done()
        })
})


test("Test ControllerUser Update Address - /user/update", async (done) => {
    let data={city:"TestCity",country:"TestCountry",street:"TestStreet",number:"333",zip:16166}
    const res = await request(server)
        .post("/user/update")
        .field('userdata',JSON.stringify(data))
        .set("Cookie",coockie)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            expect(response.body.data.city).toEqual('TestCity')
            expect(response.body.data.country).toEqual('TestCountry')
            expect(response.body.data.street).toEqual('TestStreet')
            expect(response.body.data.number).toEqual('333')
            expect(response.body.data.zip).toEqual(16166)

            done()
        })
})

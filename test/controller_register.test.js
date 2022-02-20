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

beforeAll(() => {
    let repository = new repos()
    repository.init()
})

afterAll(async (done) => {
    try {
        fs.rmdir('.\/' + process.env.DIR_UPLOAD_TEST, {recursive: true}, (err) => {
            model_user.deleteMany().then((res) => done())
        });
    } catch {
        rimraf('.\/' + process.env.DIR_UPLOAD_TEST, () => {
            model_user.deleteMany().then(() => done())
        });
    }
});
let coockie
test("Test ControllerRegister /register - Invalid user name", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"a","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('user is not valid (just alphabet,number._, max length is 16)')
            done()
        })
})

test("Test ControllerRegister /register - Invalid Email", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice","email":"test","password":"omega","confirmed":false,"name":"un1","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('password is not valid (Must have upper/lower case , specific char)')
            done()
        })
})

test("Test ControllerRegister /register - Invalid Password", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice","email":"test@test.com","password":"1","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('password is not valid (Must have upper/lower case , specific char)')
            done()
        })
})

test("Test ControllerRegister /register - Invalid codiceFiscale", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alicd","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('codiceFiscale Length is 16 and Only Number and alphabet')
            done()
        })
})

test("Test ControllerRegister /register", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            repository.update_user_verification("1111111111111111", (err, res) => {
                done()
            })

        })
})

test("Test ControllerRegister /register - duplicate username", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('userName Already Taken')
            done()
        })
})

test("Test ControllerRegister /register - duplicate email , different username", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice2","email":"test@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('email Already Taken')
            done()
        })
})

test("Test ControllerRegister /register - duplicate CF", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice2","email":"test2@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"ali","surename":"uuuuu","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('codiceFiscale Already Taken')
            done()
        })
})

test("Test ControllerRegister /register - / login", async (done) => {
    let data = {
        username: "alice",
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

// test("Test ControllerRegister /register - /user/verify", async (done) => {
//     let data = {codiceFiscale: 1111111111111111}
//
//     const res = await request(server)
//         .put("/user/verify")
//         .set("Cookie", coockie)
//         .send(data)
//         .expect(200)
//         .then((response) => {
//             expect(response.body.result).toEqual('success')
//             done()
//         })
// })
//

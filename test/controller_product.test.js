const creatServer = require('../app')
const model_product = require('../models/model_product')
const repos = require('../storage/repository')
const request = require('supertest')
const dotenv = require('dotenv');
const model_user = require('../models/model_user')
const fs = require('fs')
const rimraf = require('rimraf');
dotenv.config();
const server = creatServer()
let repository = new repos();

beforeAll(() => {
    console.log("beforeAll product")
})

afterAll(async (done) => {
    console.log("afterAll product")
    try {
        fs.rmdir('.\/' + process.env.DIR_UPLOAD_TEST, {recursive: true}, (err) => {
            model_user.deleteMany().then((res) => model_product.deleteMany().then((res) => done()))
        });
    } catch {
        rimraf('.\/' + process.env.DIR_UPLOAD_TEST, () => {
            model_user.deleteMany().then((res) => model_product.deleteMany().then((res) => done()))
        });
    }
});
let product_id
test("Test ControllerProduct /register", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/register")
        .field('usersdata', '{"userName":"alice7","email":"test7@test.com","password":"Amega111sdadasa$","confirmed":false,"name":"Alireza","surename":"Karimi","birthDay":"2014-01-22","role_user":true,"mobile":"+391234567","codiceFiscale":"1111111111111111"}')
        .attach('avatar', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            repository.update_user_verification("1111111111111111", (err, res) => {
                done()
            })
        })
})
let coockie
test("Test ControllerProduct /login", async (done) => {
    let data = {
        username: "alice7",
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

test("Test ControllerProduct /product/add", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 0.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }
    const res = await request(server)
        .post("/product/add")
        .set("Cookie", coockie)
        .field('productdata', JSON.stringify(data))
        .attach('image', filePath)
        .set("Cookie", coockie)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            product_id = response.body.data._id
            done()
        })
})

test("Test ControllerProduct /product/add - No category", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })
})

test("Test ControllerProduct /product/add - No delivery time", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })
})

test("Test ControllerProduct /product/add - NoImage", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .expect(500)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Upload an Image')
            done()
        })
})

test("Test ControllerProduct /product/add - NoName", async (done) => {
    let data = {
        username: "alice7",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please enter the Name of your Item')
            done()
        })
})

test("Test ControllerProduct /product/add - No Description", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Add Item Details')
            done()
        })
})

test("Test ControllerProduct /product/add - No price", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .set("Cookie", coockie)
        .field('productdata', JSON.stringify(data))
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Add Item  Cost')
            done()
        })
})

test("Test ControllerProduct /product/add - No quantity", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })
})

test("Test ControllerProduct /product/add - Invalid price", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 0.0,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Add Item  Cost')
            done()
        })
})

test("Test ControllerProduct /product/add - No Country", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Add Location')
            done()
        })
})

test("Test ControllerProduct /product/add - No City", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }
    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Add Location')
            done()
        })
})

test("Test ControllerProduct /product/add - No Street", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            expect(response.body.message).toEqual('Please Add Location')
            done()
        })
})

test("Test ControllerProduct /product/add - No Number", async (done) => {
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        zip: 16138,
        showContactInfo: true
    }

    const filePath = `${__dirname}/test.jpg`;
    const res = await request(server)
        .post("/product/add")
        .field('productdata', JSON.stringify(data))
        .set("Cookie", coockie)
        .attach('image', filePath)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            done()
        })
})

test("Test ControllerProduct /product/detail", async (done) => {
    const res = await request(server)
        .get("/product/detail")
        .query({productId: product_id})
        .set("Cookie", coockie)
        .expect(200)
        .then((response) => {
            expect(response.body.result).toEqual('success')
            expect(response.body.data.name).toEqual('Product1')
            done()
        })
})

test("Test ControllerProduct /product/detail - Invalid product", async (done) => {
    const res = await request(server)
        .get("/product/detail")
        .set("Cookie", coockie)
        .query({productId: '2'})
        .expect(400)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            done()
        })
})

test("Test ControllerProduct /product/detail - Not Found product", async (done) => {
    const res = await request(server)
        .get("/product/detail")
        .set("Cookie", coockie)
        .query({productId: '5fe7f7cf708dda72d665a31a'})
        .expect(404)
        .then((response) => {
            expect(response.body.result).toEqual('fail')
            done()
        })
})

test("Test ControllerProduct /product/List", async (done) => {
    const filePath = `${__dirname}/test.jpg`;
    let data = {
        username: "alice7",
        name: "Product1",
        description: "description\":\"This is not a real product",
        price: 14.1,
        category: 1,
        delivery_time: "2021-03-29T12:30:00.000Z",
        is_service: false,
        quantity: 10,
        country: "italy",
        city: "genova",
        street: "Asiago",
        number: 2,
        zip: 16138,
        showContactInfo: true
    }

    for (var i = 0; i < 9; i++) {
        data.name = "Product" + (i + 2)
        await request(server)
            .post("/product/add")
            .set("Cookie", coockie)
            .field('productdata', JSON.stringify(data))
            .attach('image', filePath)
    }

    await request(server)
        .get("/product")
        .expect(200)
        .set("Cookie", coockie)
        .then((response) => {
            expect(response.body.length).toEqual(14)
            done()
        })
})

test("Test ControllerProduct /product/List sorting /product?sort_field=name&sort_order=-1", async (done) => {
    await request(server)
        .get("/product?sort_field=name&sort_order=-1")
        .expect(200)
        .set("Cookie", coockie)
        .then((response) => {
            expect(response.body[0].name).toEqual("Product9")
            done()
        })
})

test("Test ControllerProduct /product/List paging /product?page_size=5&page_number=2", async (done) => {
    await request(server)
        .get("/product?page_size=5&page_number=2")
        .expect(200)
        .set("Cookie", coockie)
        .then((response) => {
            expect(response.body.length).toEqual(5)
            expect(response.body[0].name).toEqual("Product2")
            done()
        })
})

//Disable until wallet add
// test("Test checkout /product/checkout", async (done) => {
//     let data={
//         productId:product_id,
//     }
//
//     await request(server)
//         .post("/product/checkout")
//         .field('productdata',JSON.stringify(data))
//         .expect(200)
//         .set("Cookie",coockie)
//         .then((response) => {
//             expect(response.body.result).toEqual('success')
//             done()
//         })
// })

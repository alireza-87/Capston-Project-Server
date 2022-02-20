/**
 * This controller used to Handle Add Product Route
 */
const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const controller_root = require('./controller_root')
const upload = require('./middlewares/middleware_upload_avatar');
const {product_add} = require('../services/service_produc_add')
const {product_update} = require('../services/service_product_update')
const {product_detail} = require('../services/service_product_detail')
const {order_list} = require('../services/service_orders')
const {resize} = require("../services/service_resize_image")
const {creat_product_dir} = require('../services/service_app_dir')
const {product_list} = require('../services/service_product')
router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({extended: true}))
router.use(express.json());

router.get("/", async (req, res, next) => {
    let filter = req.query.filter ? JSON.parse(Buffer.from(req.query.filter, 'base64')) : {}

    let sort = {};
    if (req.query.sort_field) {
        if (req.query.sort_order) {
            sort[req.query.sort_field] = req.query.sort_order;
        } else {
            sort[req.query.sort_field] = 1;
        }
    }

    let page = {}
    page.page_size = req.query.page_size ? req.query.page_size : 100;
    page.page_number = req.query.page_number ? req.query.page_number - 1 : 0;

    product_list(filter, sort, page, (err, dres) => {
        res.type('application/json');
        if (err != null) {
            console.log(err)
            controller_root.req_fail(res)
        } else {
            res.send(dres)
        }
        next();
    });
});

router.post("/add", upload.single('image'), async (req, res, next) => {
    if (!req.file) {
        controller_root.req_fail_upload_avatar(res);
    } else {
        let avatar_path = await resize(req, creat_product_dir())
        let product_data = JSON.parse(req.body.productdata)
        product_data.image = avatar_path
        product_add(product_data, (process.env.NODE_ENV === "production" ? req.session.username : product_data.username), (add_err, add_res) => {// seller username will change later
            res.type('application/json');
            let message
            if (add_err != null) {
                switch (add_err) {
                    case "name":
                        message = "Please enter the Name of your Item"
                        break
                    case "description":
                        message = "Please Add Item Details"
                        break
                    case "price":
                        message = "Please Add Item  Cost"
                        break
                    case "quantity":
                        message = "Please Add quantity"
                        break
                    case "country":
                        message = "Please Add Location"
                        break
                    case "city":
                        message = "Please Add Location"
                        break
                    case "street":
                        message = "Please Add Location"
                        break
                    default:
                        message = add_err
                        break

                }
                controller_root.req_fail(res, message)
            } else {
                controller_root.req_success(res, add_res)
            }
            next();
        })
    }
})

router.post("/update", upload.single('image'), async (req, res, next) => {
    let product_data = JSON.parse(req.body.productdata)
    if (req.file){
        product_data.image = await resize(req, creat_product_dir())
    }
    product_update(product_data._id, product_data, (add_err, add_res) => {
        res.type('application/json');
        if (add_err != null) {
            controller_root.req_fail(res, add_err)
        } else {
            controller_root.req_success(res, add_res)
        }
        next();
    })
})

router.get("/detail", async (req, res, next) => {
    //let product_data=JSON.parse(req.body)
    product_detail((req.query.productId), (err, data) => {
        if (err != null) {
            controller_root.req_fail(res)
        } else if (data != null) {
            controller_root.req_success(res, data)
        } else {
            controller_root.req_fail_404(res)
        }
    })
})


router.post("/seller/products", async (req, res, next) => {
    if (!req.session.role_user)
        controller_root.req_unauth_403(res, "unauthorized action")
    else {
        let sort = {};
        if (req.body.sort_field && req.body.sort_order)
            sort[req.body.sort_field] = req.body.sort_order;
        else
            sort[req.body.sort_field] = 1;
        let page = {}
        page.page_size = req.body.page_size ? req.body.page_size : 100;
        page.page_number = req.body.page_number ? req.body.page_number - 1 : 0;

        let filter = {seller: req.body.sellerId}
        product_list(filter, sort, page, (err, dres) => {
            res.type('application/json');
            if (err != null) {
                console.log(err)
                controller_root.req_fail(res)
            } else {
                res.send(dres)
            }
            next();
        });
    }
})
// seller's ordered products
router.post("/seller/orders", async (req, res, next) => {
    if (!req.session.role_user)
        controller_root.req_unauth_403(res, "unauthorized action")
    else {
        let sort = {};
        if (req.body.sort_field && req.body.sort_order)
            sort[req.body.sort_field] = req.body.sort_order;
        else
            sort[req.body.sort_field] = 1;
        let page = {}
        page.page_size = req.body.page_size ? req.body.page_size : 100;
        page.page_number = req.body.page_number ? req.body.page_number - 1 : 0;


        order_list(req.body, sort , page, (err, dres) => {
            res.type('application/json');
            if (err != null) {
                console.log(err)
                controller_root.req_fail(res)
            } else {
                res.send(dres)
            }
            next();
        });
    }
})


module.exports = router;

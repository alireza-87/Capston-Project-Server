const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const service_wallet = require('../services/service_wallet')
const controller_root = require('./controller_root')

router.use(body_parser.json());
router.use(body_parser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }))
router.use(express.json());


router.post("/transfer", async (req, res, next) => {
    if (!req.body.amount || req.body.amount <= 0) {
        controller_root.req_fail(res, "Amount required");
        next();
    }
    else if (!req.body.address) {
        controller_root.req_fail(res, "Address required");
        next();
    }
    else if (!req.body.isFromServer && (req.body.isFromServer.toLowerCase() !== 'true' || req.body.isFromServer.toLowerCase() !== 'false')) {
        controller_root.req_fail(res, "Is From Server required");
        next();
    }
    else {
        service_wallet.transferFrom(req.body.address, req.body.amount, req.body.isFromServer.toLowerCase() === 'true', (err, dres) => {
            if (err) {
                controller_root.req_fail(res, err.message)
            } else {
                controller_root.req_success(res, dres)
            }
            next();
        });
    }
})

router.get("/balance", async (req, res, next) => {
    if (!req.query.address) {
        controller_root.req_fail(res, "Address required");
    }
    service_wallet.get_balance(req.query.address, (err, dres) => {
        if (err) {
            controller_root.req_fail(res, err.message)
        } else {
            controller_root.req_success(res, dres)
        }
        next();
    });
})


module.exports = router;

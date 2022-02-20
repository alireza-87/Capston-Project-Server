const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const controller_root = require('./controller_root')
const {order_getByOrderId} = require('../services/service_orders')
const {order_confirmByIdOrOtp} = require('../services/service_orders')
const {sendOtpBuyer} = require('../services/service_email')

router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({extended: true}))
router.use(express.json());


router.post('/otp/get', async (req, res, next) => {
    order_getByOrderId((req.body), (err, data) => {
        res.type('application/json');
        if (err != null) {
            controller_root.req_fail(res)
        } else if (data != null) {
            controller_root.req_success(res, data)
            sendOtpBuyer(data, req.get('origin'))
        } else {
            controller_root.req_fail_404(res)
        }
    })
})

router.post('/otp/confirm', async (req, res, next) => {
    order_confirmByIdOrOtp((req.body), (err, data) => {
        res.type('application/json');
        if (err)
            controller_root.req_fail(res)
        else if (data)
            controller_root.req_success(res, data)
        else
            controller_root.req_fail_404(res)
    })
})

module.exports = router;


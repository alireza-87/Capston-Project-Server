const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const {notifyResetPasswordEmail} =  require('../services/service_email')
const {
    reset_password
} = require('../services/service_resetpassword')
const controller_root = require('./controller_root')
router.use(body_parser.json());
router.use(body_parser.urlencoded({
    extended: true
}));
router.use(express.urlencoded({
    extended: true
}))
router.use(express.json());


router.put("/", async (req, res, next) => {
    reset_password(req.body, (err, result) => {
        res.type('application/json');
        if (err != null) {
            controller_root.req_fail(res, err.message)
        } else {
            controller_root.req_success(res)
            notifyResetPasswordEmail(result.value,req.get("origin"))
        }

        next();

    })
})
module.exports = router;

const express = require('express');
const emails = require('../services/service_email');
const router = express.Router()
const {resetPasswordEmail} = require('../services/service_email')
const body_parser = require('body-parser')
const {
    forget_password
} = require('../services/service_fogetpassword')
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

    forget_password(req.body, (err, result) => {
        res.type('application/json');
        if (err != null) {
            controller_root.req_fail(res, err.message)
        } else {
            let dres={}
            req.session.Token = result.Token
            dres.token=result.Token.token
            dres.message="Password reset successful, you can now login"
            controller_root.req_success(res,dres)
            resetPasswordEmail(result,req.get('origin'))
        }
        next();


    })
})
module.exports = router;

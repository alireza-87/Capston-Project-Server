/**
 * This controller used to loing
 */

const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const {
    login_user
} = require('../services/service_login')
const controller_root = require('./controller_root')
const emails = require('../services/service_email');
const user_roles = require("../helper/roles")

router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({extended: true}))
router.use(express.json());


router.post("/", async (req, res, next) => {

    login_user(req.body, (err, dres) => {

        res.type('application/json');
        if (err) {
            if (dres) {
                if (req.session.invalid_login) {
                    req.session.invalid_login++
                } else {
                    req.session.invalid_login = 1
                }
                if (req.session.invalid_login == 3) {

                    req.session.invalid_login = 0
                    emails.unusualActivityEmail(dres, req.get('origin'),req.headers["user-agent"])
                }
                console.log(req.session.invalid_login)
                controller_root.req_fail(res, err.message)
            } else {
                controller_root.req_fail(res, err.message)
            }
        } else {
            req.session.verified = dres.verified
            req.session.username = dres.userName
            req.session.role_user = dres.role_user
            req.session.role_admin = dres.role_admin
            req.session.role_helpdesk = dres.role_helpdesk
            req.session.invalid_login = 0
            req.session.user_id = dres._id.toString()
            req.session.save()
            controller_root.req_success(res, dres)
        }
        next();
    })
})


module.exports = router;

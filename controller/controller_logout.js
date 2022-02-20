/**
 * This controller used to logout
 */

const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const controller_root = require('./controller_root')

router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({extended: true}))
router.use(express.json());


router.get("/", async (req, res, next) => {
    req.session.destroy(err => {
        if (err){
            controller_root.req_fail(res, err.message);
        }
        else{
            controller_root.req_success(res)
        }
    });
})


module.exports = router;

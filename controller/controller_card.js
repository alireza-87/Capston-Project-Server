const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const service_card = require('../services/service_card')
const controller_root = require('./controller_root')

router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({extended: true}))
router.use(express.json());


router.post("/check", async (req, res, next) => {
    var cardNumber = req.body.cardNumber;
    var expiryMonth = req.body.expiryMonth;
    var expiryYear = req.body.expiryYear;
    var cvv = req.body.cvv;
    
    if(cardNumber && expiryMonth && expiryYear && cvv){
        service_card.check_validity(cardNumber, expiryMonth, expiryYear, cvv, (err, dres) => {
            if (err) {
                controller_root.req_fail(res, err.message)
            } else {
                controller_root.req_success(res, dres)
            }
            next();
        });
    }
    else{
        if(!cardNumber){
            controller_root.req_fail(res, "Card Number required");
        }
        else if(!expiryMonth){
            controller_root.req_fail(res, "Expiry Month required");
        }
        else if(!expiryYear){
            controller_root.req_fail(res, "Expiry Year required");
        }
        else if(!cvv){
            controller_root.req_fail(res, "CVV required");
        }
        next();
    }
})


module.exports = router;

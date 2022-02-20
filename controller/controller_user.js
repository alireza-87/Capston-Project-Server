/**
 * This controller used to loing
 */
const {MongoError} = require('mongodb')
const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const {service_user_verification} = require('../services/service_user_verification')
const {update_user,update_user_confirmation} = require('../services/service_user_update')
const {checkout} = require('../services/service_checkout')
const controller_root = require('./controller_root')
const upload = require('./middlewares/middleware_upload_avatar');
const {userUpdateConfirmation,userUpdateOtp} = require('../services/service_email')
const {send_update_confirm,send_update_otp_sms} = require('../services/service_sms')
const {resize} = require("../services/service_resize_image")
const {creat_avatar_dir} = require('../services/service_app_dir')


router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({extended: true}))
router.use(express.json());


router.put("/verify", async (req, res, next) => {
    if (process.env.NODE_ENV === "production" && !req.session.role_helpdesk) {
        controller_root.req_unauth_403(res, 'Unauthorized action')
    } else {
        service_user_verification(req.body, (err, dres) => {
            res.type('application/json');
            if (err) {
                controller_root.req_fail(res, err.message)
            } else {
                req.session.verified = true
                controller_root.req_success(res, dres)
            }
            next();
        })
    }

})
//user's chekcout
router.post("/checkout",upload.single(''),async (req,res,next)=>{
    let product_data=JSON.parse(req.body.productdata)
    checkout(req.session.user_id,product_data,(err,data)=>{
        if (err == null){
            controller_root.req_success(res,data)
        }else{
            controller_root.req_fail(res,err)
        }
    })
})

router.post("/update",upload.single('avatar'),async (req,res,next)=>{
    let user_data=JSON.parse(req.body.userdata)
    if (req.file) {
        let avatar_path=await resize(req,creat_avatar_dir())
        user_data.avatar=avatar_path
    }
    let is_email_update=(user_data.email)?true:false
    let is_phone_update=(user_data.mobile)?true:false
    update_user(req.session.user_id,user_data,(err,user_res)=>{
        if (err==null){
            controller_root.req_success(res,user_res)
            if (is_email_update && is_phone_update){
                userUpdateOtp(user_res)
                send_update_otp_sms(user_res)
            }else if (is_email_update){
                send_update_otp_sms(user_res)
            }else if(is_phone_update){
                userUpdateOtp(user_res)
            }
        }else{
            let message
            switch (err){
                case "email":
                    message="email format is not valid"
                    break
                case "userName":
                    message="user is not valid (just alphabet,number._, max length is 16)"
                    break
                case "mobile":
                    message="mobile is not valid (minimum length is 10)"
                    break
                default:
                    message=err
                    break

            }
            controller_root.req_fail(res,message)

        }
        next()
    })

})

router.post("/update/confirm",upload.single(''),async (req,res,next)=>{
    update_user_confirmation(req.session.user_id,req.body,(err,d_res)=>{
        if (err==null){
            controller_root.req_success(res,d_res)
            send_update_confirm(d_res)
            userUpdateConfirmation(d_res)
        }else{
            if(err instanceof MongoError){
                switch (err.code) {
                    case 11000:
                        const [key, value]  = Object.entries(err.keyValue)[0]
                        controller_root.req_fail(res,`${key} Already Taken`)
                        break;
                    default:
                        controller_root.req_fail(res)
                        break;
                }
            }else{
                controller_root.req_fail(res,err)
            }
        }
        next()
    })

})


module.exports = router;

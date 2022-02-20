/**
 * This controller used to register new user
 */
const express = require('express');
const router = express.Router()
const body_parser = require('body-parser')
const controller_root = require('./controller_root')
const upload = require('./middlewares/middleware_upload_avatar');
const {MongoError} = require('mongodb')
const {user_register} = require('../services/service_register')
const {resize} = require("../services/service_resize_image")
const {creat_avatar_dir} = require('../services/service_app_dir')
const {notifyRegisterEmail} = require('../services/service_email')
router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));
router.use(express.urlencoded({ extended: true }))
router.use(express.json());

router.post("/" ,upload.single('avatar'), async (req,res,next)=>{
    let user_data=JSON.parse(req.body.usersdata)
    if (req.file) {
        let avatar_path=await resize(req,creat_avatar_dir())
        user_data.avatar=avatar_path
    }
    user_register(user_data,(err,dres)=>{
        res.type('application/json');
        if(err!=null){
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
                let message
                switch (err){
                    case "codiceFiscale":
                        message="codiceFiscale Length is 16 and Only Number and alphabet"
                        break
                    case "email":
                        message="email format is not valid"
                        break
                    case "password":
                        message="password is not valid (Must have upper/lower case , specific char)"
                        break
                    case "userName":
                        message="user is not valid (just alphabet,number._, max length is 16)"
                        break
                    case "mobile":
                        message="mobile is not valid (minimum length is 10)"
                        break
                    case "name":
                        message="name is not valid (just alphabet)"
                        break
                    case "sureName":
                        message="name is not valid (just alphabet)"
                        break
                    default:
                        message=err
                        break

                }
                controller_root.req_fail(res,message)
            }
        }else{
            controller_root.req_success(res,dres)
            notifyRegisterEmail(dres)
        }
        next();
    })
})

module.exports = router;

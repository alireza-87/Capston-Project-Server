/**
 * Main class of application
 */
const repos = require('./storage/repository')
const express = require('express')
const session = require('express-session')
const body_parser = require('body-parser');
const controller_register = require('./controller/controller_register');
const controller_product_add = require('./controller/controller_product');
const service_error_handle = require('./services/service_error_handle')
const controller_login = require('./controller/controller_login');
const controller_logout = require('./controller/controller_logout');
const controller_forget_password = require('./controller/controller_forget_password');
const controller_reset_password = require('./controller/controller_reset_password');
const controller_user = require('./controller/controller_user');
const controller_root = require('./controller/controller_root');
const controller_order = require('./controller/controller_order');
const controller_wallet = require('./controller/controller_wallet');
const controller_card = require('./controller/controller_card');
const cors = require('cors');
const server = express();
server.use(body_parser.text({type: 'text/plain'}));
//////////////////////////////////////////

const creatServer = function () {
    //Init DataBase
    let repository = new repos()
    repository.init()
    console.log(process.env.NODE_ENV)
    let sessionMiddleware = session({
        key: 'user_sid',
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000
        }
    });
    server.use(sessionMiddleware);
    let  auth= function (req,res,next){
        if (!req.session.username) {
            controller_root.req_unauth_403(res,'No credentials Found,Please Login again ...')
        }else{
            next()
        }
    }

    server.use(cors({
            origin: "http://localhost:4200",
            credentials:true,
            cookie:{
                secure:false
            },
            methods: "PUT,POST,GET,DELETE"})
    );

    //Routing
    server.use('/register', controller_register);
    server.use('/login', sessionMiddleware, controller_login);
    server.use('/logout', sessionMiddleware, auth, controller_logout);
    server.use('/user',sessionMiddleware, auth,  controller_user);
    server.use('/foget_password', controller_forget_password);
    server.use('/reset_password', controller_reset_password);
    server.use('/product', sessionMiddleware, controller_product_add);
    server.use('/order', sessionMiddleware, auth, controller_order);
    server.use('/wallet', sessionMiddleware, auth, controller_wallet);
    server.use('/card', sessionMiddleware, auth, controller_card);
    server.use('/images/upload', express.static( process.env.DIR_UPLOAD + '/'))

    server.use((error, req, res, next) => {
        console.log(error)
        service_error_handle.error_handle(error, res)
    });
    return server
}

module.exports = creatServer

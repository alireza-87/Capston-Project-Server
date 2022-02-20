const user_schema = require('../models/model_user')
const repos = require('../storage/repository')
const service_wallet = require('../services/service_wallet')
var crypto = require('crypto');
var bcrypt = require('bcrypt');
let repository=new repos()

const user_register = (data,delegate) =>{

    let sha256 = crypto.createHash('sha256');
    const salt = bcrypt.genSaltSync(10);
    let db_data = new user_schema({
        userName:data.userName,
        password:bcrypt.hashSync(data.password, salt),
        email:data.email,
        confirmed:data.confirmed,
        verified:false,
        name:data.name,
        sureName:data.surename,
        birthDay: new Date(data.birthDay),
        role_user:data.role_user,
        zip:data.zip,
        country:data.country,
        city:data.city,
        street:data.street,
        number:data.number,
        mobile:data.mobile,
        wallet:service_wallet.create_wallet(),
        photo:data.avatar,
        codiceFiscale:data.codiceFiscale,
    })
    const regex=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/

    if (!regex.test(String(data.password).toLowerCase())){
        return delegate('password')
    }else{
        const error = db_data.validateSync();
        if(error){
            const [key, value]  = Object.entries(error.errors)[0]
            delegate((`${key}`))
        }else{
            repository.insert_user(db_data,(err,dres)=>{
                if(delegate!=null)
                    delegate(err,dres)
            })
        }
    }

}  

exports.user_register = user_register;

/**
 * User model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validator_codice_fiscale = function(value) {
    const reg= /^[A-Za-z0-9]{16}$/
    return reg.test(String(value))
}

const validator_email = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
}

const validator_pass = function(value) {
    const regex=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
    return regex.test(String(value).toLowerCase())
}

const validator_user_name = function(value) {
    const regex=/^[A-Za-z0-9._]{2,16}$/
    return regex.test(String(value))
}


const validator_mobile = function(value) {
    return value.length > 9
}

const validator_name = function (name){
    const reg= /^[A-Za-z]+$/
    return reg.test(String(name))
}

const validator_not_empty = function(value) {
    return value.length > 0
}

let user_schema =new Schema({
    userName:{
        type:String,
        required:true,
        validate: [validator_user_name, 'username is not valid'],
        unique:true
    },
    password:{type:String,required:true},
    email:{unique:true,type:String,required:true,validate: [validator_email, 'email is not valid']},
    confirmed:Boolean,
    verified:Boolean,
    name:{type:String,required:true,validate: [validator_name, 'name is not valid']},
    sureName:{type:String,required:true,validate: [validator_name, 'surname is not valid']},
    birthDay:{ type : Date, default: Date.now },
    role_user:Boolean,
    role_admin:Boolean,
    role_helpdesk:Boolean,
    mobile:{type:String,required:true,validate: [validator_mobile, 'mobile is not valid']},
    wallet:{type:Object,required:true},
    codiceFiscale:{type:String,required:true,unique:true,validate:[validator_codice_fiscale,"Fiscal code is not valid"]},
    photo:String,
    zip:Number,
    country:String,
    city:String,
    street:String,
    number:String,
    new_email:{type:String,validate: [validator_email, 'new_email is not valid']},
    new_mobile:{type:String,validate: [validator_mobile, 'new_mobile is not valid']},
    otp_update:{type:Object}
})
user_schema.set('toJSON', {
    getters: true,
    transform: (doc, ret) => {
        if (ret.photo) {
            ret.photo = process.env.IMAGE_BASE+ret.photo.toString().replace(process.env.DIR_UPLOAD,'');
        }
        if (ret.password)
            delete ret.password

        if (ret.new_email)
            delete ret.new_email

        if (ret.new_mobile)
            delete ret.new_mobile

        if (ret.otp_update)
            delete ret.otp_update

        delete ret.__v;
        return ret;
    },
})

// user_schema.pre('findOneAndUpdate', function(next) {
//     if (this.getUpdate().$set.userName ||
//         this.getUpdate().$set.name ||
//         this.getUpdate().$set.sureName ||
//         this.getUpdate().$set.birthDay ||
//         this.getUpdate().$set.codiceFiscale ) {
//         throw 'updated read only field'
//     }else{
//         return next();
//     }
// })

user_schema.index({userName:1, codiceFiscale:1,email:1}, { unique: true });
module.exports = mongoose.model('model_user', user_schema,"model_user");

/**
 * produc model
 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator_not_empty = function(value) {
    return value.length > 0
}

const validator_price = function(value) {
    return value > 0.0
}

const validator_quantity = function(value) {
    return value > 0
}


let product_schema = mongoose.Schema({
    name:{type:String,required:true,validate: [validator_not_empty, 'name is not valid']},
    description:{type:String,required:true,validate: [validator_not_empty, 'description is not valid']},
    price:{
        type:Schema.Types.Decimal128,
        required:true,
        validate: [validator_price, 'price is not valid']
    },
    category:{
        type:Number
    },
    delivery_time:{
        type:Array
    },
    is_service:{
        type:Boolean,
        required:true,
        default:false

    },
    quantity:{
        type:Number
    },
    image:{//Store link to image
        type:String,
        required:true
    },
    publication_date:{
        type : Date,
        default: Date.now,
        required:true
    },
    country:{type:String,required:true,validate: [validator_not_empty, 'country is not valid']},
    city:{type:String,required:true,validate: [validator_not_empty, 'city is not valid']},
    street:{type:String,required:true,validate: [validator_not_empty, 'street is not valid']},
    number:String,
    zip:Number,
    showContactInfo:{type:Boolean,default:false},
    seller: {
        type: Schema.Types.ObjectId,
        ref: "model_user"
    }
})
//Convert price to readable format
product_schema.set('toJSON', {
    getters: true,
    transform: (doc, ret) => {
        if (ret.price) {
            ret.price = Number(ret.price.toString());
            ret.total_price = Number(ret.price.toString())+(Number(ret.price.toString())*0.01)
        }
        if (ret.image) {
            ret.image = process.env.IMAGE_BASE+ret.image.toString().replace(process.env.DIR_UPLOAD,'');
        }


        if (ret.delivery_time) {
            ret.real_delivery_time = ret.delivery_time[0]
        }else{
            ret.real_delivery_time = ret.publication_date
        }

        if (ret.seller) {
            delete ret.seller.password
            delete ret.seller.codiceFiscale
            if (!ret.showContactInfo){
                delete ret.seller.email
                delete ret.seller.mobile
                delete ret.seller.country
                delete ret.seller.city
                delete ret.seller.zip
                delete ret.seller.number
            }
            if (ret.seller.wallet)
                delete ret.seller.wallet
            delete ret.seller.role_admin
            delete ret.seller.role_helpdesk
            delete ret.seller.role_user
        }

        delete ret.__v;
        return ret;
    },
})
module.exports = mongoose.model('product_schema', product_schema,"product_schema");
const mongoDbs = require('./mongo/database')
const product_schema = require('../models/model_product')
const user_schema = require('../models/model_user')
const order_schema = require('../models/model_order')
const schema_names = require('../models/schema_names')
const otpGenerator = require('otp-generator')
const mongoose = require('mongoose')
let localDataBase

/**
 * This class contain all method inorder to interaction with MongoDB
 */
class repository {

    get_user(user_id, delegate) {
        user_schema.findById(user_id).limit(1).exec(function (err, data) {
            if (err === null)
                delegate(err, data)
            else
                delegate(err)
        })
    }


    /**
     * fine user
     * @param user user input of login
     * @param delegate CallBack with (err,res)
     */
    find_user(user, delegate) {

        user_schema.findOne({
            $or: [{
                "userName": user.username
            }, {
                "email": user.email
            }]
        }, (err, result) => {

            if (delegate != null)
                delegate(err, result);
        });
    }

    update_user(filter, update, delegate) {
        user_schema.findOneAndUpdate(filter, {$set: update}, {new: true,useFindAndModify: false}, (err, result) => {
            if (err)
                delegate(err)
            else
                delegate(err, result)
        })
    }


    /**
     * update token of specfic user in db
     * @param Token token of specific user
     * @param delegate CallBack with (err,res)
     */
    updat_token(Token, delegate) {
        localDataBase.collection("model_user").findOneAndUpdate({
            "_id": Token.user_id
        }, {
            $set: {
                "Token.token": Token.token,
                "Token.expires": Token.expires
            },
        }, {
            new: true,
            returnOriginal: false
        }, (err, result) => {

            if (delegate != null)
                delegate(err, result);
        });
    }


    /**
     * find valid Token of specific user
     * @param Token token of specific user
     * @param delegate CallBack with (err,res)
     */

    find_token(Token, delegate) {
        let date = new Date();
        localDataBase.collection("model_user").findOne({
            'Token.token': Token.token,
            'Token.expires': {
                $gt: date
            }
        }, (err, result) => {
            if (delegate != null)
                delegate(err, result);
        });
    }


    /**
     * Register a new user
     * @param id _id of  user
     *@param password  new password
     *@param token token of user
     * @param delegate CallBack with (err,res)
     */
    updat_password(id, password, token, delegate) {

        localDataBase.collection("model_user").findOneAndUpdate({
            "_id": id
        }, {
            $set: {
                "password": password,
                "Token.token": token
            }
        }, (err, result) => {
            if (delegate != null)
                delegate(err, result);
        });
    }


    /**
     * Register a new user
     * @param user User Model
     * @param delegate CallBack with (err,res)
     */
    insert_user(user, delegate) {
        localDataBase.collection("model_user").insertOne(user).then(result => {
            this.get_user(result.insertedId.toString(), delegate)
        }).catch(err => {
            delegate(err)
        });
    }

    product_list(filter, sort, page, delegate) {
        product_schema.find(filter).populate("seller").sort(sort).skip(page.page_number * page.page_size).limit(Number(page.page_size)).exec((err, data) => {
            if (delegate)
                delegate(err, data);
        });
    }

    /**
     * Insert Product for sale
     * @param product Product model
     * @param seller_username Seller UserName
     * @param delegate CallBack with (err,res)
     */
    insert_product(product, seller_username, delegate) {

        localDataBase.collection("model_user").findOne({userName: seller_username}, (u_err, u_res) => {
            if (u_err != null) {
                delegate(u_err)
            } else if (u_res != null) {

                product.seller = u_res._id

                localDataBase.collection("product_schema").insertOne(product).then(result => {

                    this.get_product(result.insertedId.toString(), delegate)
                    //delegate(ins_err, ins_res)
                })
            } else {
                delegate("user not found")
            }
        })

    }

    update_product(filter, update, delegate) {
        product_schema.findOneAndUpdate(filter, {$set: update}, {new: true,useFindAndModify: false}, (err, result) => {
            if (err)
                delegate(err)
            else
                delegate(err, result)
        })
    }

    get_product(product_id, delegate) {
        product_schema.findById(product_id).populate("seller").limit(1).exec(function (err, data) {
            if (err === null)
                delegate(err, data)
            else
                delegate(err)
        })
    }

    update_user_verification(codiceFiscale, delegate) {

        user_schema.findOneAndUpdate({
                "codiceFiscale": codiceFiscale
            }, {
                $set: {
                    "verified": true
                }
            }, {useFindAndModify: false},
            (err, result) => {

                if (delegate != null)
                    delegate(err, result);
            });
    }


    //order queries **************************************************************************** ORDER QUERIES

    get_orderByOrderId(req_data, delegate) {
        //seller id and product id should be used in order schema
        order_schema.aggregate([
            {
                $match:
                    {
                        $and: [{_id: {$eq: mongoose.Types.ObjectId(req_data.order_id)}}]
                    }
            },
            {
                $lookup:
                    {
                        from: schema_names.collection_name.model_user,
                        localField: "buyer_id",
                        foreignField: "_id",
                        as: "buyer_info"
                    }
            },
            {$unwind: "$buyer_info"}
        ]).exec((err, result) => {
            if (err)
                delegate(err)
            else
                delegate(err, result[0])
        })
    }

    update_orderById(data, delegate) {
        if (data) {
            order_schema.updateOne(
                {_id: mongoose.Types.ObjectId(data.order_id)}, {
                    $set: {otp_code: otpGenerator.generate(6, {upperCase: false, specialChars: false})}
                }, (err, result) => {
                    if (err)
                        delegate(err)
                    else
                        delegate(err, result)

                })
        }
    }

    updateOrderByOrderOtpId(req_data, delegate) {
        // if (req_data.order_id !== null && req_data.otp_code !== null) {
        //     order_schema.aggregate([
        //         {
        //             $match: {
        //                 $and: [{_id: {$eq: mongoose.Types.ObjectId(req_data.order_id)}}, {otp_code: {$eq: req_data.otp_code}}]
        //             }
        //         }
        //     ]).exec((err, result) => {
        //         if (err)
        //             delegate(err)
        //         else
        //             delegate(err, result[0])
        //     })
        // }
        if (req_data.otp_code !== null && req_data.otp_code !== undefined) {

            order_schema.findOneAndUpdate({otp_code: req_data.otp_code}, {$set: {isConfirmed: true}}, {new: true}, (err, result) => {
                if (err)
                    delegate(err)
                else
                    delegate(err, result)
            })

        } else if (req_data.order_id !== null && req_data.order_id !== undefined) {

            order_schema.findOneAndUpdate({_id: mongoose.Types.ObjectId(req_data.order_id)}, {$set: {isConfirmed: true}}, {new: true}, (err, result) => {
                if (err)
                    delegate(err)
                else
                    delegate(err, result)
            })
        }
    }

    orderAggregateById(req_data, delegate) {
        order_schema.aggregate([
            {
                $match:
                    {

                        $or: [
                            {_id: {$eq: mongoose.Types.ObjectId(req_data.order_id)}},
                            {otp_code: {$eq: req_data.otp_code}}
                        ]

                    }
            },
            {
                $lookup:
                    {
                        from: schema_names.collection_name.model_user,
                        localField: "buyer_id",
                        foreignField: "_id",
                        as: "buyer_info"
                    }
            },
            {$unwind: "$buyer_info"},
            {
                $lookup:
                    {
                        from: schema_names.collection_name.model_user,
                        localField: "seller_id",
                        foreignField: "_id",
                        as: "seller_info"
                    }
            },
            {$unwind: "$seller_info"},
            {
                $lookup:
                    {
                        from: schema_names.collection_name.product_schema,
                        localField: "product_id",
                        foreignField: "_id",
                        as: "product_info"
                    }
            },
            {$unwind: "$product_info"}
        ]).exec((err, result) => {
            if (err)
                delegate(err)
            else
                delegate(err, result[0])
        })
    }

    orderAggregate(match_filter, sort, page, delegate) {
        order_schema.aggregate([
            {$sort: sort},
            {$skip: page.page_number * page.page_size},
            {$limit: Number(page.page_size)},
            match_filter,
            {
                $lookup:
                    {
                        from: schema_names.collection_name.model_user,
                        localField: "buyer_id",
                        foreignField: "_id",
                        as: "buyer_info"
                    }
            },
            {$unwind: "$buyer_info"},
            {
                $lookup:
                    {
                        from: schema_names.collection_name.model_user,
                        localField: "seller_id",
                        foreignField: "_id",
                        as: "seller_info"
                    }
            },
            {$unwind: "$seller_info"},
            {
                $lookup:
                    {
                        from: schema_names.collection_name.product_schema,
                        localField: "product_id",
                        foreignField: "_id",
                        as: "product_info"
                    }
            },
            {$unwind: "$product_info"}
        ]).exec((err, result) => {
            if (err)
                delegate(err)
            else
                delegate(err, result)
        })
    }


    add_purchase(purchase, delegate) {
        user_schema.findById(purchase.buyer_id).exec(function (err, data) {
            user_schema.findByIdAndUpdate(purchase.buyer_id, {$set: {"wallet": (data.toJSON().wallet - purchase.toJSON().total_price)}})
                .then(result1 => {
                    let _data;
                    localDataBase.collection("order").insertOne(purchase).then(result2 => {
                        _data   = {
                            wallet:  (data.toJSON().wallet - purchase.toJSON().total_price),
                            order_id: result2.insertedId.toString()
                        }

                        delegate(null, _data)
                    })
                }).catch(err => {
                delegate(err)
            })

        })
    }

    init() {
        localDataBase = mongoDbs.get();
    }
}

module.exports = repository

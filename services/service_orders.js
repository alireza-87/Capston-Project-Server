const repos = require('../storage/repository')
const { mailWalletMoneyAdded } = require('../services/service_email')
const { mailBuyerDeliveryConfirmed } = require('../services/service_email')
const mongoose = require('mongoose')
const Double = require("mongoose").Double

let repository = new repos()

const order_getByOrderId = (req_data, delegate) => {
    repository.update_orderById(req_data, (err, data) => {
        if (data) {
            repository.get_orderByOrderId(req_data, (err, data) => {
                delegate(err, data);
            })
        } else
            delegate(err, data)
    })

}

const order_confirmByIdOrOtp = (req_data, delegate) => {
    repository.updateOrderByOrderOtpId(req_data, (err, data) => {

        if (data) {
            addToSellerWallet(data, (err, result) => {
                if (result) {
                    repository.orderAggregateById(req_data, (err, aggregateDoc) => {
                        mailBuyerAndSeller(req_data, aggregateDoc)
                        delegate(err, aggregateDoc)
                    })
                }

            })
        }else{
            delegate(err)
        }
      

    })
}

const mailBuyerAndSeller = (req_data, data) => {
    mailWalletMoneyAdded(data).then()
    mailBuyerDeliveryConfirmed(data).then()
}

const addToSellerWallet = (data, delegate) => {
    let price;
    console.log(data)
    repository.get_product(data.product_id, (err, product) => {

        if (product) {
            price = product.price - (product.price * 1 / 100);
            repository.get_user(data.seller_id, (err, userDocument) => {
                if (userDocument) {
                    let _wallet = userDocument.wallet;
                    let finalWallet = parseFloat(_wallet) + parseFloat(price);
                    const filter = { _id: mongoose.Types.ObjectId(data.seller_id) }
                    const update = { wallet: finalWallet }
                    repository.update_user(filter, update, (err, result) => {
                        delegate(err, result)
                    })
                }
            })

        }
    })
}

const order_list = (req_data, sort, page, delegate) => {
    let filter = { $match: { seller_id: mongoose.Types.ObjectId(req_data.sellerId) } }
    repository.orderAggregate(filter, sort, page, (err, result) => {
        delegate(err, result)
    })
}
module.exports = { order_getByOrderId, order_confirmByIdOrOtp, order_list };

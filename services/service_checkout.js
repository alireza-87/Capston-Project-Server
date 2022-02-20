const repos = require('../storage/repository')
const order_schema = require('../models/model_order')
let repository = new repos();

const checkout = (user_id, product_data, delegate) => {
    repository.get_user(user_id, (err, res) => {
        if (err == null) {
            if (res.verified) {
                repository.get_product(product_data.productId, (err_p, res_p) => {
                    if (err_p == null) {
                        if (res.toJSON().wallet >= res_p.toJSON().total_price) {
                            let data = new order_schema({
                                buyer_id: user_id,
                                seller_id: res_p.seller._id,
                                product_id: product_data.productId,
                                total_price: res_p.toJSON().total_price,
                                isConfirmed: false,
                                date: Date.now(),
                                otp_code: ""
                            })
                            repository.add_purchase(data, (err_add_purchase, res_add_purchase) => {
                                if (delegate != null)
                                    delegate(err_add_purchase, res_add_purchase)
                            })
                        } else {
                            delegate("Not Enough Money")
                        }
                    } else {
                        delegate("Product not found")
                    }
                })
            } else {
                delegate("User is not Verified")
            }
        } else {
            delegate("User not found")
        }
    })
}

exports.checkout = checkout

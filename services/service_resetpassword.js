const user_schema = require('../models/model_user')
const repos = require('../storage/repository')

var bcrypt = require('bcrypt');
let repository = new repos();


const reset_password = (data, delegate) => {
    try {

        const salt = bcrypt.genSaltSync(10);

        repository.find_token(data, (err, dres) => {

            if (!dres) return Promise.reject(new Error("Invalid Token")).catch(err => {
                if (delegate != null)
                    delegate(err)
            });


            return new Promise((resolve, reject) => {
                if (data.password != data.confirmPassword) return reject(new Error("Passwords not Equal"));
                else {
                    dres.password = bcrypt.hashSync(data.password, salt)
                    dres.Token.token = null
                    repository.updat_password(dres._id, dres.password, dres.Token.token, (err, result) => {
                        if (!result) return reject(new Error("Password hasn't updated"))
                        if (delegate != null)
                            delegate(err, result)

                    })
                }
            }).catch(err => {
                if (delegate != null)
                    delegate(err)
            });
        })
    } catch (ex) {
        delegate(ex)
    }
}


exports.reset_password = reset_password;

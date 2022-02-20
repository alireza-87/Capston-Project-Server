const repos = require('../storage/repository')
const emails = require('./service_email');
let bcrypt = require('bcrypt');
let repository = new repos();
const login_user = (data, delegate) => {
    try {
        repository.find_user(data, (err, dres) => {

            if (!dres) return Promise.reject(new Error("the credentials are invalid")).catch(err => {
                if (delegate != null)
                    delegate(err)
            });

          if (!dres.verified) return Promise.reject(new Error("the user is not verified")).catch(err => {
            if (delegate != null)
              delegate(err)
          });

          return new Promise((resolve, reject) => {
                bcrypt.compare(data.password, dres.password, (err, res) => {
                    if (res) {
                        if (delegate != null)
                            delegate(err, dres)
                    } else {
                        reject(new Error("the credentials are invalid"))
                    }
                })
            }).catch(err => {
                if (delegate != null)
                    delegate(err, dres)
            })


        })


    } catch (ex) {
        delegate(ex)
    }
}

exports.login_user = login_user;

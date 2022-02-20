  const repos = require('../storage/repository')

  const jwt = require('jsonwebtoken');
  var crypto = require('crypto');
  const MailMessage = require('nodemailer/lib/mailer/mail-message');
  let repository = new repos();

  function randomTokenString() {

    var token = jwt.sign({
      _id: crypto.randomBytes(10).toString('hex')
    }, process.env.JWT_SECRET).toString();

    return token;

  };


  const forget_password = (data, delegate) => {
    try {
 

      repository.find_user(data, (err, dres) => {
        if (!dres) return Promise.reject(new Error("the credentials are invalid")).catch(err => {
          if (delegate != null)
            delegate(err)
        });
        return new Promise((resolve, reject) => {

          Token = {
            user_id: dres._id,
            token: randomTokenString(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
          };
          repository.updat_token(Token, (err, result) => {
            if (!result.value) return reject(new Error("Token hasn't updated"))
            if (delegate != null)
              delegate(err, result.value)

          })
        }).catch(err => {
          if (delegate != null)
            delegate(err)
        });


      })

    } catch (ex) {
      delegate(ex)
    }
  }




  exports.forget_password = forget_password;

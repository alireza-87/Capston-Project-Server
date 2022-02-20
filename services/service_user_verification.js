const repos = require('../storage/repository')
const emails = require('./service_email');

let repository = new repos();
const service_user_verification = (data, delegate) => {
    try {
        repository.update_user_verification(data.codiceFiscale, (err, dres) => {

            if (!dres) return Promise.reject(new Error("User dosen't Exist")).catch(err => {
                if (delegate != null)
                    delegate(err)
            });
            if (dres.verified) return Promise.reject(new Error("User has been verified")).catch(err => {
                if (delegate != null)
                    delegate(err)
            });
            if(!dres.verified) {
                emails.userVerificationEmail(dres)
                let result ={}
                result.name=dres.name
                result.sureName=dres.sureName
                result.codiceFiscale=dres.codiceFiscale
                result.msg="verified Email has been sent"
                if (delegate != null)
                    delegate(err,result)
            }

        });

    }
    catch (ex) {
        delegate(ex)
    }}


exports.service_user_verification = service_user_verification;

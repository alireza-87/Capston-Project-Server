const repos = require('../storage/repository')
const otpGenerator = require('otp-generator')
let repository = new repos()

const update_user_confirmation=(user_id,data,delegate) =>{
    const filter = { _id: user_id }
    repository.get_user(user_id, (user_err,user_doc)=>{
        if (!user_err && user_doc){
            if (user_doc.otp_update.otp === data.otp){
                user_doc.email=user_doc.new_email
                user_doc.mobile=user_doc.new_mobile
                repository.update_user(filter,user_doc,(err,res)=>{
                    user_doc.new_mobile=undefined
                    user_doc.new_email=undefined
                    user_doc.otp_update=undefined
                    user_doc.save()
                    if (delegate!=null)
                        delegate(err,res)
                })
            }else{
                delegate("wrong code")
            }
        }else{
            delegate("user not found")
        }
    })
}

const update_user = (user_id,data,delegate) =>{
    const filter = { _id: user_id }
    repository.get_user(user_id,(err,u_doc)=>{
        if (!err && u_doc){
            u_doc.country=data.country
            u_doc.city=data.city
            u_doc.street=data.street
            u_doc.number=data.number
            u_doc.new_email=data.email
            u_doc.new_mobile=data.mobile
            u_doc.zip=data.zip
            u_doc.photo=data.avatar
            const error = u_doc.validateSync();
            if(error){
                const [key, value]  = Object.entries(error.errors)[0]
                delegate((`${key}`))
            }else{

                if (data.email || data.mobile){
                    let otp_update = {
                        otp: otpGenerator.generate(6, {upperCase: false, specialChars: false}),
                        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
                    };
                    u_doc.otp_update=otp_update
                }
                repository.update_user(filter,u_doc,(err,res)=>{
                    if (delegate!=null)
                        delegate(err,res)
                })
            }
        }else{
            delegate(err)
        }
    })
}
exports.update_user=update_user
exports.update_user_confirmation=update_user_confirmation

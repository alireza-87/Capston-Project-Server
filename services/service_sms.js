const twilio = require('twilio');


const send_update_otp_sms=(account)=>{
    let client = new twilio(process.env.SMS_ACCOUNT_SID, process.env.SMS_AUTH_TOKEN);
    client.messages.create({
        body: `otp code : ${account.otp_update.otp}`,
        to: account.mobile,
        from: process.env.SMS_NUMBER
    }).then((message) => console.log(message.sid));
}

const send_update_confirm=(account)=>{
    let client = new twilio(process.env.SMS_ACCOUNT_SID, process.env.SMS_AUTH_TOKEN);
    client.messages.create({
        body: `Your Mobile/Email Updated successfully`,
        to: account.mobile,
        from: process.env.SMS_NUMBER
    }).then((message) => console.log(message.sid));
}

exports.send_update_otp_sms=send_update_otp_sms
exports.send_update_confirm=send_update_confirm

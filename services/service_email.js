const {
    models
} = require("mongoose");
const browser = require('browser-detect');
const sendEmail = require('../helper/send_email');

async function unusualActivityEmail(account, origin, header) {
    let fullUrl
    if (origin)
        fullUrl = origin + "/login"
    else
        fullUrl = process.env.PROTOCOL_LINK + "login"

    const result = browser();
    let date = new Date();
    await sendEmail({
        to: account.email,
        subject: 'no-reply Unusual sigin-in activity',
        html: `<h4 align="left">Dear ${account.name}</h4>
<p align="left">we've noticed some unusual activity on your account, and we're concerned about potential unauthorized account access<br /> <br />your account <strong>${account.userName}</strong>&nbsp;has just been accessed form:<br />${header}</p>
<p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${fullUrl}">Click here to login your account</a> </button> </p>
<p align="left">&nbsp;</p>
<p align="left">Copyright 2020 EasyPeasy &copy;</p>
<p align="left">[Scrum Zombies]</p>
<p align="left">GENOVA, ITAY</p>
<p align="left "><strong>${date}</strong></p>
<p align="left">&nbsp;</p>`
    });
}

async function resetPasswordEmail(account, origin) {
    //URL:
    let token = account.Token.token

    let date = new Date();
    let fullUrl
    if (origin)
        fullUrl = origin + "/resetpassword/" + token
    else
        fullUrl = process.env.PROTOCOL_LINK + "resetpassword" + '?token=' + token
    await sendEmail({
        to: account.email,
        subject: 'no-reply Reset Your Password',
        html: `<h4 align="left">Dear ${account.name}</h4>
<p align="left">You recently requested to reset your password for your EasyPeasy account. Use the button below to reset it. This password reset is only valid for the next 24 hours.</p>
<p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${fullUrl}">Reset your password </a> </button> <br /></p>

<p align="left">&nbsp;</p>
<p align="left">Copyright 2020 EasyPeasy &copy;</p>
<p align="left">[Scrum Zombies]</p>
<p align="left">GENOVA, ITAY</p>
<p align="left "><strong>${date}</strong></p>
<p align="left">&nbsp;</p>`
    });
}

async function sendOtpBuyer(data, origin) {

    let url
    if (origin)
        url = origin + 'order/otp/get'
    else
        url = process.env.PROTOCOL_LINK + "order/otp/get"
    let date = new Date()

    await sendEmail({
        to: data.buyer_info.email,
        subject: 'otp code of your purchase , please send it to the provider of this product',
        html: `<h4 align="left">Dear ${data.buyer_info.name}</h4>
    <p align="left">this is the otp code of your order : ${data.otp_code}</p>
    <p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${url}">otp confirmation </a> </button> <br /></p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });
}

async function mailWalletMoneyAdded(data, origin) {
    let url
    if (origin)
        url = origin + 'order/otp/confirm'
    else
        url = process.env.PROTOCOL_LINK + "order/otp/confirm"
    let date = new Date()

    await sendEmail({
        to: data.seller_info.email,
        subject: 'the money of the product purchase has been added to your wallet',
        html: `<h4 align="left">Dear ${data.seller_info.name}</h4>
    <p align="left">product name : ${data.product_info.name}</p>
    <p align="left">product price : ${data.product_info.price}</p>
    <p align="left">your current wallet value: ${data.seller_info.wallet}</p>
    <p align="left">the customer of this product: ${data.buyer_info.name}</p>
    <p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${url}">otp confirmation </a> </button> <br /></p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });
}


async function mailBuyerDeliveryConfirmed(data, origin) {
    let url
    if (origin)
        url = origin + 'order/otp/confirm'
    else
        url = process.env.PROTOCOL_LINK + "order/otp/confirm"
    let date = new Date()

    await sendEmail({
        to: data.buyer_info.email,
        subject: 'your purchase delivery has been confirmed by the seller',
        html: `<h4 align="left">Dear ${data.buyer_info.name}</h4>
    <p align="left">product name : ${data.product_info.name}</p>
    <p align="left">product price : ${data.product_info.price}</p>
    <p align="left">seller name : ${data.seller_info.name}</p>
    <p align="left">your wallet value : ${data.buyer_info.wallet}</p>
    <p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${url}">otp confirmation </a> </button> <br /></p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });
}


async function notifyResetPasswordEmail(account, origin) {
    //URL:
    let fullUrl
    if (origin)
        fullUrl = origin + "/login"
    else
        fullUrl = process.env.PROTOCOL_LINK + "login"

    let date = new Date();
    await sendEmail({
        to: account.email,
        subject: 'no-reply Reset Your Password',
        html: `<h4 align="left">Dear ${account.name}</h4>
    <p align="left">You recently requested to reset your password for your EasyPeasy account. We would like to inform you that your Password has been changed.</p>
    <p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${fullUrl}">Login </a> </button> <br /></p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });
}

async function notifyRegisterEmail(account, req) {
    //URL:

    let fullUrl = process.env.PROTOCOL_LINK + "login"

    let date = new Date();
    await sendEmail({
        to: account.email,
        subject: 'no-reply Register',
        html: `<h4 align="left">Dear user</h4>
    <p align="left">You recently created an account. You have to contact go to the nearest help desk and get verified.</p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });
}

async function userVerificationEmail(account) {
    //URL:

    let fullUrl = process.env.PROTOCOL_LINK + "login"

    let date = new Date();
    await sendEmail({
        to: account.email,
        subject: 'no-reply Verification',
        html: `<h4 align="left">Dear user</h4>
    <p align="left">You recently created an account. We would like to inform you that the account has been verified.</p>
    <p align="left"><button style="background-color: #008cba; border: 0px; padding: 12px 28px;"><a style="text-decoration: none; color: #ffffff;" href="${fullUrl}">Login </a> </button> <br /></p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });

}

async function userUpdateOtp(account) {
    let fullUrl = process.env.PROTOCOL_LINK + "login"
    let date = new Date();
    await sendEmail({
        to: account.email,
        subject: 'no-reply Update Email/Mobile',
        html: `<h4 align="left">Dear user</h4>
    <p align="left">You have just requested a change of phone number/Email.</p>
    <p align="left">your Code :  ${account.otp_update.otp}</p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });

}

async function userUpdateConfirmation(account) {
    let fullUrl = process.env.PROTOCOL_LINK + "login"
    let date = new Date();
    await sendEmail({
        to: account.email,
        subject: 'no-reply Update Email/Mobile',
        html: `<h4 align="left">Dear user</h4>
    <p align="left">Your Mobile/Email Updated successfully</p>
    
    <p align="left">&nbsp;</p>
    <p align="left">Copyright 2020 EasyPeasy &copy;</p>
    <p align="left">[Scrum Zombies]</p>
    <p align="left">GENOVA, ITAY</p>
    <p align="left "><strong>${date}</strong></p>
    <p align="left">&nbsp;</p>`
    });

}

module.exports = {
    resetPasswordEmail,
    unusualActivityEmail,
    notifyResetPasswordEmail,
    notifyRegisterEmail,
    userVerificationEmail,
    userUpdateConfirmation,
    userUpdateOtp,
    sendOtpBuyer, mailWalletMoneyAdded, mailBuyerDeliveryConfirmed
};

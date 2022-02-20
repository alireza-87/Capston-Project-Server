
const req_fail = (response,message) =>{
    response.status(400)
    response.json({result: 'fail',message:message})
}

const req_fail_404 = (response,message) =>{
    response.status(404)
    response.json({result: 'fail',message:message})
}

const req_unauth_403 = (response,message) =>{
    response.status(403)
    response.json({result: 'fail',message:message})
}

const req_success = (response,data) =>{
    response.status(200)
    response.json({result: 'success',data:data})
}

const req_fail_upload_file_size = (response) =>{
    response.status(500)
    response.json({result: 'fail',message: 'file is too  large'})
}

const req_fail_upload_file_type = (response) =>{
    response.status(500)
    response.json({result: 'fail',message: 'file type erro'})
}

const req_fail_upload_avatar = (response) =>{
    response.status(500)
    response.json({result: 'fail',message: 'Please Upload an Image'})
}

const req_fail_upload_general = (response) =>{
    response.status(500)
    response.json({result: 'fail',message: 'an error occure'})
}

exports.req_fail = req_fail
exports.req_success = req_success
exports.req_fail_upload_file_size = req_fail_upload_file_size
exports.req_fail_upload_general = req_fail_upload_general
exports.req_fail_upload_file_type = req_fail_upload_file_type
exports.req_fail_upload_avatar = req_fail_upload_avatar
exports.req_fail_404=req_fail_404
exports.req_unauth_403=req_unauth_403
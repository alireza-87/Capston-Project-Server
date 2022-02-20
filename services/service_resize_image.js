const fs = require('fs')
const sharp = require('sharp')
const path = require('path');
const {creat_avatar_dir} = require('./service_app_dir')
/**
 * A service inorder to resize an image
 * @param {*} req 
 */
const  image_resize = async (req,dest) =>{
    const { filename: image } = req.file 
    await sharp(req.file.path)
    .resize(500)
    .jpeg({quality: 50})
    .toFile(
        path.resolve(dest,image)
    )
    if (fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path)
    return dest.replace('.','')+image
}

exports.resize=image_resize

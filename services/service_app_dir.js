const fs = require('fs')

/**
 * Creat Directory for avatar
 */
const creat_avatar_dir = () =>{
    let date = new Date();
    let year = date.getFullYear();
    let mounth = date.getMonth();
    let day = date.getDay();
    let dir = process.env.DIR_UPLOAD
    if (process.env.NODE_ENV === 'development'){
        dir = process.env.DIR_UPLOAD
    }else if (process.env.NODE_ENV === 'test'){
        dir = process.env.DIR_UPLOAD_TEST
    }else if (process.env.NODE_ENV === 'production'){
        dir = process.env.DIR_UPLOAD
    }
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }

    dir =dir+ `\/avatars`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }

    dir = dir+`\/`+`${year}`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    dir = dir+`\/`+`${mounth}`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    dir = dir+`\/`+`${day}`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    return dir+`\/`
}

const creat_product_dir = () =>{
    let date = new Date();
    let year = date.getFullYear();
    let mounth = date.getMonth();
    let day = date.getDay();

    let dir = process.env.DIR_UPLOAD
    if (process.env.NODE_ENV === 'development'){
        dir = process.env.DIR_UPLOAD
    }else if (process.env.NODE_ENV === 'test'){
        dir = process.env.DIR_UPLOAD_TEST
    }else if (process.env.NODE_ENV === 'production'){
        dir = process.env.DIR_UPLOAD
    }
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }

    dir = dir+`\/product_image`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    dir = dir+`\/`+`${year}`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    dir = dir+`\/`+`${mounth}`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    dir = dir+`\/`+`${day}`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    return dir+`\/`
}

const creat_upload_temp_dir = () =>{
    let dir = process.env.DIR_UPLOAD
    if (process.env.NODE_ENV === 'development'){
        dir = process.env.DIR_UPLOAD
    }else if (process.env.NODE_ENV === 'test'){
        dir = process.env.DIR_UPLOAD_TEST
    }else if (process.env.NODE_ENV === 'production'){
        dir = process.env.DIR_UPLOAD
    }
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }

    dir = dir+`\/temp`
    if (!fs.existsSync(dir)){
        try{
            fs.mkdirSync(dir);
        }catch (ex){

        }
    }
    return dir+`\/`
}

exports.creat_avatar_dir=creat_avatar_dir
exports.creat_upload_temp_dir=creat_upload_temp_dir
exports.creat_product_dir=creat_product_dir

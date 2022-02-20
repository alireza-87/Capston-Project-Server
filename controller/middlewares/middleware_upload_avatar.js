const multer = require('multer')
const path = require('path');
const {creat_upload_temp_dir} = require('../../services/service_app_dir')

/**
 * Middle ware for upload Image
 */

 //File size
const limit = {
    fileSize: 10*1024*1024,
  }

// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, creat_upload_temp_dir() );
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

//file type
const file_filter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: file_filter ,limits:limit});
module.exports = upload

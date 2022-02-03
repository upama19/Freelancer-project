const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // might need to handle some errors later
        cb(null, 'uploads')
    }, 
    filename(req, file, cb) {
        const ext = file.originalname.substring(file.originalname.lastIndexOf('.'))

        cb(null, file.fieldname + '-' + Date.now()+ ext)
    }
})

module.exports = multer({
    storage,
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file'))
        }

        cb(undefined, true)
    }
})
